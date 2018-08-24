import os
import time
import sqlite3
import subprocess

curDir = os.path.dirname(os.path.realpath(__file__))
subprocess.call(['sudo', curDir + '/ledon', '0', 'y'])

#funkcija za proveru iskljucenja
def updateTableOutTime(tableNameStr,outTimeStr):
	conn = sqlite3.connect(curDir + "/LogBase.db")
	cursor = conn.cursor()
	cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;",(tableNameStr,))
	tablesNum = cursor.fetchall()
	if len(tablesNum)==0:
		print "Ne postoji takva tabela"
	else:
		update_sql = "update "+tableNameStr+" set Izlaz = ? where Izlaz is null;"
		cursor.execute(update_sql,(outTimeStr,))
		conn.commit()
		print "upisivanje izlaza"
	conn.close()
	return

file = open(curDir + "/shutdown_time.txt","r")
shutdownTime  =  file.readline()
if shutdownTime != "":
	shutdownTime = shutdownTime.split()
	tableName = shutdownTime[0]
	outTime = shutdownTime[1] + " " + shutdownTime[2]
	print tableName
	print outTime
	updateTableOutTime(tableName,outTime)
	time.sleep(10)
	subprocess.call(['sudo', 'bash', curDir + '/sys_time.bash', '3'])
	
prevTime = ""
curTime = ""
file.close()

subprocess.call(['sudo', curDir + '/ledon', '0', 'g'])
subprocess.Popen(['sudo', 'bash', curDir + '/check_connection.bash'])

while True:
	#######################
	curTime = subprocess.check_output('sudo date "+%d"', shell=True)
	if((curTime != prevTime) and (prevTime != "")):
		file = open(curDir+ "/shutdown_time.txt","r")
		shutdownTime  =  file.readline()
		shutdownTime = shutdownTime.split()
		tableName = shutdownTime[0]
		outTime = shutdownTime[1] + " " + shutdownTime[2]
		updateTableOutTime(tableName,outTime)
	#######################
	os.system('sudo date "+T%d_%m_%y %Y-%m-%d %T.%6N" > '+curDir+'/shutdown_time.txt')
	os.system('sudo python '+ curDir +'/station_check_instance.py')
	prevTime = subprocess.check_output('sudo date "+%d"', shell=True)
	#time.sleep(10)
	
