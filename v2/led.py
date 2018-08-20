import RPi.GPIO as GPIO
import time
from threading import Thread

NUMBER_OF_LEDS = 2
leds = [None] * NUMBER_OF_LEDS

R_PORTS = [13, 16]
G_PORTS = [19, 20]
B_PORTS = [26, 21]

PWM_RANGE = 1800
PERIOD_RANGE = 12

def close():
	for l in leds:
		if l != None:
			l._stop()
			del l

class Led:
	def __init__(self, index = 0):
		if not is_ok_index(index):
			raise ValueError('LED index out of range')
		elif leds[index] != None:
			raise ValueError('Indexed LED already exists. Use leds[] array to reference it');
		else:
			self.index = index
			self._init_ports()
			
			self._active_flag = self._blink_flag = False
			self._active_thread = self._blink_thread = None
			
			leds[index] = self
	def __del__(self):
		self._stop()
	def close(self):
		self._stop()
		leds[self.index] = None
		del self
	
	def _init_ports(self):
		GPIO.setmode(GPIO.BCM)
		GPIO.setwarnings(False)
		GPIO.setup(R_PORTS[self.index], GPIO.OUT)
		GPIO.setup(G_PORTS[self.index], GPIO.OUT)
		GPIO.setup(B_PORTS[self.index], GPIO.OUT)
		
		self.r = R_PORTS[self.index]
		self.g = G_PORTS[self.index]
		self.b = B_PORTS[self.index]
	
	def on(self, color, intensity = 100):
		if not is_ok_color(color):
			raise ValueError('Color name not recognized')
		elif not (0 <= intensity and intensity <= 100):
			raise ValueError('Intensity out of range')
		else:
			self._stop()
			self._activate(color, intensity)
	
	def off(self):
		self._stop()
	
	def blink(self, color, freq, intensity = 100):
		if not is_ok_color(color):
			raise ValueError('Color name not recognized')
		elif not (freq > 0):
			raise ValueError('Frequency out of range')
		elif not (0 <= intensity and intensity <= 100):
			raise ValueError('Intensity out of range')
		else:
			self._stop()
			self._activate_blinking(color, freq, intensity)
	
	def is_on(self):
		return self._active_flag
	def is_off(self):
		return not self.is_on()
	
	def _activate(self, color, intensity = 100):
		self._active_thread = Thread(target = Led._activate_thread,
				args = (self, color, intensity, ))
		self._active_flag = True
		self._active_thread.start()
	
	def _activate_thread(self, color, intensity):
		step = 1.0 * PWM_RANGE / (intensity * (PWM_RANGE / 100))
		steps = step
		cnt = 0
		while self._active_flag:
			if cnt >= steps:
				val = 1
				steps = steps + step
			else:
				val = 0
			if cnt >= PWM_RANGE:
				cnt = 0
				steps = step
			else:
				cnt = cnt + 1
			
			sz = len(self.color_ports(color))
			for i in range(0, sz):
				port = self.color_ports(color)[i]
				range_chunk = PERIOD_RANGE / sz
				if i * range_chunk <= (cnt % PERIOD_RANGE) and (cnt % PERIOD_RANGE) < (i + 1) * range_chunk:
					GPIO.output(port, val)
				else:
					GPIO.output(port, 0)
		
		for port in self.color_ports(color):
			GPIO.output(port, 0)
	
	def _deactivate(self):
		if self._active_flag:
			self._active_flag = False
			self._active_thread.join()
	
	def _activate_blinking(self, color, freq, intensity):
		self._blink_thread = Thread(target = Led._blinking_thread,
				args = (self, color, freq, intensity, ))
		self._blink_flag = True
		self._blink_thread.start()
	
	def _blinking_thread(self, color, freq, intensity):
		t = (1.0 / freq) * 0.5
		while self._blink_flag:
			self._activate(color, intensity)
			time.sleep(t)
			self._deactivate()
			time.sleep(t)
	
	def _deactivate_blinking(self):
		if self._blink_flag == True:
			self._blink_flag = False
			self._blink_thread.join()
	
	def _stop(self):
		self._deactivate_blinking()
		self._deactivate()
	
	def color_ports(self, c):
		if c == 'red':
			return [self.r]
		elif c == 'green':
			return [self.g]
		elif c == 'blue':
			return [self.b]
		elif c == 'yellow':
			return [self.r, self.g]
		elif c == 'purple':
			return [self.r, self.b]
		elif c == 'cyan':
			return [self.g, self.b]
		elif c == 'white':
			return [self.r, self.g, self.b]
		else:
			return None

def is_ok_index(index):
	return 0 <= index and index < NUMBER_OF_LEDS

def has_r(color):
	return color == 'red' or color == 'yellow' or color == 'purple' or color == 'white'

def has_g(color):
	return color == 'green' or color == 'yellow' or color == 'cyan' or color == 'white'

def has_b(color):
	return color == 'blue' or color == 'purple' or color == 'cyan' or color == 'white'

def is_ok_color(color):
	return has_r(color) or has_g(color) or has_b(color)
