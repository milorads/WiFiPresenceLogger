import subprocess
import re
import time
from datetime import datetime

import mysql.connector

# MySQL database handlers
db = mysql.connector.connect(
	host='localhost',
	user='root',
	passwd='root',
	database='wifi_presence_logger_logs'
)
dbcursor = db.cursor()

# Logging class
class LoggerLevel:
	def __init__(self):
		pass
	
	@staticmethod
	def severity():
		global_severity = 1
		# 1 - Trace, 2 - Info, 3 - Warning, 4 - Error
		return global_severity

#presence check exception class
class PresenceCheckerException(Exception):
	def __init__(self, msg, original_exception):
		super(PresenceCheckerException, self).__init__(msg + (": %s" % original_exception))
		self.original_exception = original_exception

# method for logging
def log(severity, message, exception = None):
	if severity >= LoggerLevel.severity():
		print(message)
		if exception is not None:
			print exception.message

#method for calling a shell command
def subprocess_cmd(command):
	log(2, "Running subprocess command -> "+str(command))
	try:
		output = subprocess.check_output(command, shell=True)
		log(1, "Subprocess out: "+str(output))
		return output
	except Exception:
		return "null"


#######################################################################################################
#######################################################################################################
try:
	try:
		log(2,"Calling iw dev wlan0 station dump | grep wlan0")
		stat_call = subprocess_cmd('iw dev wlan0 station dump | grep "wlan0"')
		log(1,str(stat_call))
	except Exception, e:
		log(3,"Error in station dump fetching")
		raise PresenceCheckerException("Error in arp table fetching",e)
	try:
		if(stat_call != "null"):
			deviceRows = stat_call.split('\n')
			now = time.strftime('%Y-%m-%d %H-%M-%S')
			dbcursor.callproc('startLogging')
			db.commit()
			
			del deviceRows[-1]
			for dev in deviceRows:
				row = dev.split()
				dbcursor.callproc('logDevice', (row[1], now, ))
			db.commit()
			dbcursor.callproc('finishLogging', (now, ))
			db.commit()
			log(2,"Successfully finished queries")
	except Exception, e:
		log(3, "Error in inserting to database")
		raise PresenceCheckerException("Error in inserting to database", e)
except PresenceCheckerException, e:
	log(4, e.message, e)
