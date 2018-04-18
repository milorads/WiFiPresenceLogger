import os
import time
import sqlite3
#funkcija za proveru iskljucenja

curDir = os.path.dirname(os.path.realpath(__file__)) 
file = open(curDir+ "/shutdown_time.txt","r")
shutdownTime  =  file.readline()
if shutdownTime != "":
	shutdownTime = shutdownTime.split()
	tableName = shutdownTime[0]
	outTime = shutdownTime[1] + " " + shutdownTime[2]
	print tableName
	print outTime
	conn = sqlite3.connect(curDir + "/LogBase.db")
	cursor= conn.cursor()
	cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;",(tableName,))
	tablesNum = cursor.fetchall()
	if len(tablesNum)==0:
		print "Ne postoji takva tabela"
	else:
		update_sql = "update "+tableName+" set Izlaz = ? where Izlaz is null;"
		cursor.execute(update_sql,(outTime,))
		conn.commit()
		print "upisivanje izlaza"
	conn.close()
	time.sleep(30)
	os.system('sudo bash /home/admin/WiFiPresenceLogger/v2/rtc_sync.bash')
while True:
	os.system('date "+T%d_%m_%y %Y-%m-%d %T.%6N" > '+curDir+'/shutdown_time.txt')
	os.system('sudo python '+ curDir +'/arp_check_instance.py')
	time.sleep(30)
