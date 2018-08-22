import RPi.GPIO as GPIO
import time
from threading import Thread
import threading

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
		self.r_num = R_PORTS[self.index]
		self.g_num = G_PORTS[self.index]
		self.b_num = B_PORTS[self.index]
		
		GPIO.setup(self.r_num, GPIO.OUT)
		GPIO.setup(self.g_num, GPIO.OUT)
		GPIO.setup(self.b_num, GPIO.OUT)
		
		self.r_num = R_PORTS[self.index]
		self.g_num = G_PORTS[self.index]
		self.b_num = B_PORTS[self.index]
		
		self.r = GPIO.PWM(self.r_num, 300)
		self.g = GPIO.PWM(self.g_num, 300)
		self.b = GPIO.PWM(self.b_num, 300)
		
		self.r.start(0)
		self.g.start(0)
		self.b.start(0)
	
	def on(self, color = 'green', intensity = 70):
		if not is_ok_color(color):
			raise ValueError('Color name not recognized')
		else:
			self._stop()
			self._activate(color, intensity)
	
	def off(self):
		self._stop()
	
	def blink(self, color = 'green', freq = 1, intensity = 70):
		if not is_ok_color(color):
			raise ValueError('Color name not recognized')
		elif not is_ok_frequency(freq):
			raise ValueError('Frequency out of range')
		else:
			self._stop()
			self._activate_blinking(color, freq, intensity)
	
	def _activate(self, color, intensity):
		for p in self.color_ports(color):
			if p == self.r:
				p.ChangeDutyCycle(intensity * (2.0/3.2))
			else:
				p.ChangeDutyCycle(intensity)
	def _deactivate(self):
		for p in [self.r, self.g, self.b]:
			p.ChangeDutyCycle(0)
	
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
	
	def color_ports(self, c):
		l = list()
		rgb = rgb_color(c)
		if rgb.count('r') > 0:
			l.append(self.r)
		if rgb.count('g') > 0:
			l.append(self.g)
		if rgb.count('b') > 0:
			l.append(self.b)
		return l

def is_ok_index(i):
	return 0 <= i and i < NUMBER_OF_LEDS
def is_ok_frequency(f):
	return f > 0 and f <= 100

def rgb_color(c):
	if c == 'red' or c == 'error':
		return ['r']
	elif c == 'green' or c == 'success':
		return ['g']
	elif c == 'blue' or c == 'ok':
		return ['b']
	elif c == 'yellow' or c == 'warning':
		return ['r', 'g']
	elif c == 'purple':
		return ['r', 'b']
	elif c == 'cyan':
		return ['g', 'b']
	elif c == 'white' or c == 'neutral':
		return ['r', 'g', 'b']
	else:
		return list()

def is_ok_color(c):
	return len(rgb_color(c)) > 0
