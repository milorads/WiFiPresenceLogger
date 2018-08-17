import RPi.GPIO as GPIO
import time
from threading import Thread

NUMBER_OF_LEDS = 2
diodes = [None] * NUMBER_OF_LEDS

R_PORTS = [13, 16]
G_PORTS = [19, 20]
B_PORTS = [26, 21]

PWM_STEP = 1000

def init():
	init_ports()
	for i in range(0, NUMBER_OF_LEDS):
		diodes[i] = Led(i)

def init_ports():
	GPIO.setmode(GPIO.BCM)
	GPIO.setwarnings(False)
	for i in range(0, NUMBER_OF_LEDS):
		GPIO.setup(R_PORTS[i], GPIO.OUT)
		GPIO.setup(G_PORTS[i], GPIO.OUT)
		GPIO.setup(B_PORTS[i], GPIO.OUT)
		
def abort():
	for d in diodes:
		if d != None:
			d.off()

class Led:
	def __init__(self, index = 0):
		if not is_ok_index(index):
			raise ValueError('LED index out of range')
		elif diodes[index] != None:
			raise ValueError('Indexed LED already exists. Use diodes[] array');
		else:
			self.r = R_PORTS[index]
			self.g = G_PORTS[index]
			self.b = B_PORTS[index]
			
			self._active_flag = self._blink_flag = False
			self._active_thread = self._blink_thread = None
	
	def on(self, color, intensity = 100):
		if not is_ok_color(color):
			raise ValueError('Color name not recognized')
		elif intensity < 0 or intensity > 100:
			raise ValueError('Intensity invalid')
		else:
			self._stop()
			self._activate(color, intensity)
	
	def off(self):
		self._stop()
	
	def blink(self, color, freq, intensity = 100):
		if not is_ok_color(color):
			raise ValueError('Color name not recognized')
		elif freq <= 0:
			raise ValueError('Frequency not valid')
		elif intensity < 0 or intensity > 100:
			raise ValueError('Intensity not valid')
		else:
			self._stop()
			self._activate_blinking(color, freq, intensity)
	
	def _activate(self, color, intensity = 100):
		self._active_thread = Thread(target = Led._activate_thread,
				args = (self, color, intensity, ))
		self._active_flag = True
		self._active_thread.start()
	
	def _activate_thread(self, color, intensity):
		step = 1000.0 / (intensity * 10)
		steps = step
		cnt = 0
		while self._active_flag:
			if cnt >= steps:
				val = 1
				steps = steps + step
			else:
				val = 0
			if cnt >= 1000:
				cnt = 0
				steps = step
			else:
				cnt = cnt + 1
			
			for port in self.color_ports(color):
				if val != GPIO.input(port):
					GPIO.output(port, val)
			time.sleep(1.0 / PWM_STEP)
		
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
