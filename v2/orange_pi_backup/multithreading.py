import threading
import time
import os
from threading import Thread


def arpProcess():
        os.system('python baseWriteArpTest.py')
        time.sleep(15)

def serverRun():
        os.system('sudo node ../detektor_prisustva_node/server2.js')


arpThread = Thread(target = arpProcess())
serverThread = Thread(target = serverRun())

arpThread.start()
serverThread.start()
while True:
		print "running"
