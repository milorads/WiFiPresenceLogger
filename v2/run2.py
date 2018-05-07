import os
import time
import sqlite3
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

curDir = os.path.dirname(os.path.realpath(__file__)) 
file = open(curDir+ "/shutdown_time.txt","r")
shutdownTime  =  file.readline()
if shutdownTime != "":
	shutdownTime = shutdownTime.split()
	tableName = shutdownTime[0]
	outTime = shutdownTime[1] + " " + shutdownTime[2]
	print tableName
	print outTime
	updateTableOutTime(tableName,outTime)
	time.sleep(30)
	os.system('sudo bash /home/admin/WiFiPresenceLogger/v2/rtc_sync.bash')
	prevTime = ""
	curTime = ""
file.close
while True:
	#######################
	curTime = subprocess.check_output('sudo date "+%d"', shell=True)
	if((curTime != prevTime) && (prevTime != "")):
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
	time.sleep(30)
	
