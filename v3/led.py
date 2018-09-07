import subprocess
import os
dir = os.path.dirname(os.path.realpath(__file__))

def on(index, color):
	subprocess.call(['sudo', dir + '/ledon', index, color])
def off(index):
	subprocess.call(['sudo', dir + '/ledoff', index, color])
