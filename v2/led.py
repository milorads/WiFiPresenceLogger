import RPi.GPIO as GPIO
import time
from threading import Thread

NUMBER_OF_LEDS = 2
leds = [None] * NUMBER_OF_LEDS

R_PORTS = [13, 16]
G_PORTS = [19, 20]
B_PORTS = [26, 21]

def close():
	for l in leds:
		if l != None:
			l.close()

class Led:
	def __init__(self, index = 0):
		if not is_ok_index(index):
			raise ValueError('LED index out of range')
		elif leds[index] != None:
			self = leds[index]
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
	
	def on(self, color = 'green', intensity = 40):
		if not is_ok_color(color):
			raise ValueError('Color name not recognized')
		elif not is_ok_intensity(intensity):
			raise ValueError('Intensity out of range')
		else:
			self._stop()
			self._activate(color, intensity)
	
	def off(self):
		self._stop()
	
	def blink(self, color = 'green', freq = 1, intensity = 40):
		if not is_ok_color(color):
			raise ValueError('Color name not recognized')
		elif not is_ok_frequency(freq):
			raise ValueError('Frequency out of range')
		elif not is_ok_intensity(intensity):
			raise ValueError('Intensity out of range')
		else:
			self._stop()
			self._activate_blinking(color, freq, intensity)
	
	def is_on(self):
		return self._active_flag
	def is_off(self):
		return not self.is_on()
	
	def _activate(self, color, intensity):
		self._active_thread = Thread(target = Led._activate_thread,
				args = (self, color, intensity, ))
		self._active_flag = True
		self._active_thread.start()
	
	def _activate_thread(self, color, intensity):
		step = 100.0 / intensity
		cnt = 0.0
		color_cnt = 0
		
		ports = self.color_ports(color)
		sz = len(ports)
		
		while self._active_flag:
			if color_cnt == 0:
				if cnt >= step:
					val = 1
					cnt = cnt - step
				else:
					val = 0
				cnt = cnt + 1
			GPIO.output(ports[(color_cnt - 1) % sz], 0)
			GPIO.output(ports[color_cnt], val)
			color_cnt = (color_cnt + 1) % sz
			time.sleep(0.001)
		
		for p in ports:
			GPIO.output(p, 0)
	
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
		self._deactivate()
	
	def _deactivate_blinking(self):
		if self._blink_flag == True:
			self._blink_flag = False
			self._blink_thread.join()
	
	def _stop(self):
		self._deactivate_blinking()
		self._deactivate()
		for p in [self.r, self.g, self.b]:
			GPIO.output(p, 0)
	
	def color_ports(self, c):
		if c == 'red' or c == 'error':
			return [self.r]
		elif c == 'green' or c == 'success':
			return [self.g]
		elif c == 'blue':
			return [self.b]
		elif c == 'yellow' or c == 'warning':
			return [self.r, self.g]
		elif c == 'purple':
			return [self.r, self.b]
		elif c == 'cyan':
			return [self.g, self.b]
		elif c == 'white' or c == 'blank':
			return [self.r, self.g, self.b]
		else:
			return None

def is_ok_index(i):
	return 0 <= i and i < NUMBER_OF_LEDS
def is_ok_intensity(i):
	return 0 <= i and i <= 100
def is_ok_frequency(f):
	return f > 0 and f <= 100

def has_r(c):
	return c == 'red' or c == 'yellow' or c == 'purple' or c == 'white'

def has_g(c):
	return c == 'green' or c == 'yellow' or c == 'cyan' or c == 'white'

def has_b(c):
	return c == 'blue' or c == 'purple' or c == 'cyan' or c == 'white'

def is_ok_color(c):
	return has_r(c) or has_g(c) or has_b(c)
