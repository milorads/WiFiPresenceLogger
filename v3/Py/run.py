import os
import time
import subprocess
import mysql.connector

py_dir = os.path.dirname(os.path.realpath(__file__)) + '/'
bash_dir = py_dir + '../Bash/'
c_dir = py_dir + '../C/'
temp_dir = py_dir + '../Temp/'

subprocess.call(['sudo', c_dir + 'ledon', '0', 'y'])
subprocess.call(['sudo', 'bash', bash_dir + 'wait_for_mysql.bash'])

db = mysql.connector.connect(
	host = 'localhost',
	user = 'root',
	passwd = 'root',
	database = 'wifi_presence_logger_logs'
)
dbcursor = db.cursor()

#funkcija za proveru iskljucenja
def db_end_all_logs(end_time):
	dbcursor.callproc('endAllLogs', [end_time])
	db.commit()
	print "upisivanje izlaza"

file = open(temp_dir + "shutdown_time.txt", "r")
shutdown_time = file.readline()

if shutdown_time != "":
	print shutdown_time
	db_end_all_logs(shutdown_time)
	subprocess.call(['sudo', 'bash', bash_dir + 'sys_time.bash', '3'])#TODO: this will break since sys_time is in bash/sys_time

prev_time = ""
cur_time = ""
file.close()

subprocess.call(['sudo', c_dir + 'ledon', '0', 'g'])
subprocess.Popen(['sudo', 'bash', bash_dir + 'check_connection.bash'])#TODO: this will break since sys_time is in bash/wait_for_mysql

while True:
	#######################
	cur_time = subprocess.check_output('sudo date "+%d"', shell=True)
	if ((cur_time != prev_time) and (prev_time != "")):
		file = open(temp_dir + "shutdown_time.txt", "r")
		shutdown_time  =  file.readline()
		db_end_all_logs(shutdown_time)
	prev_time = subprocess.check_output('sudo date "+%d"', shell=True)
	#######################
	subprocess.call('sudo date "+%Y-%m-%d %T.%2N" > ' + temp_dir + 'shutdown_time.txt', shell=True)
	subprocess.call(['sudo', 'python', py_dir + 'station_check_instance.py'])
	time.sleep(30)
