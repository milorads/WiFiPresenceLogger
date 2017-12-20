import time
import subprocess
import re
import sqlite3
from datetime import datetime

class ArpModel(object):
    #Attributes:
    #hostName: name of the device that is connected to the ap
    #ipAddress: ip address given to the device connected
    #macAddress: physical address of the connected device
    def __init__(self, ip, mac, host = "Unknown"):
        #Constructor with host name defaulted to Unknown in case it cannot be parsed
        self.hostName = host
        self.ipAddress = ip
        self.macAddress = mac
    def GetIp(self):
	return (self.ipAddress)
    def GetMac(self):
	return (self.macAddress)
    def GetHost(self):
	return (self.hostName)
    pass

def subprocess_cmd(command):
    output = subprocess.check_output(command,shell = True)
    return output

def checkBase(arpModels,databaseModels):
    print("checkBase")

def addToBase(arpModels,tableName):
	conn = sqlite3.connect("LogBase.db")
	cursor = conn.cursor()
	sql ="INSERT INTO "+tableName + " (Ip,Mac,Ulaz,Izlaz) VALUES(?,?,?,?)"
	dTime = datetime.now()
	for i in arpModels:
		cursor.execute(sql,[i.GetIp(),i.GetMac(),dTime,None])
		conn.commit()
	conn.close()

arpl =  subprocess_cmd("arp -a | grep 'wlan0' | grep -v '<unknown>'")
arp_array = arpl.splitlines()
arrayOfModels = list()

for i in arp_array:
    pom = i.split()
    pom[1] = re.sub('[()]','',pom[1])
    currentModel = ArpModel(pom[1],pom[3],pom[0])
    arrayOfModels.append(currentModel)

tableName = "T"+datetime.now().strftime('%d_%m_%y')
conn = sqlite3.connect("LogBase.db")
cursor = conn.cursor() 
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (tableName,))
rows = cursor.fetchall()
if len(rows) == 0:
    #create table + write all from models
    cursor.execute("CREATE TABLE " + tableName + " (LogBaseId integer PRIMARY KEY NOT NULL UNIQUE,Mac TEXT,Ip TEXT,Ulaz DATETIME,Izlaz DATETIME)")
    addToBase(arrayOfModels,tableName)
else:
    cursor.execute("SELECT * FROM "+tableName)
    arrayOfDatabaseEntries = cursor.fetchall()
    print arrayOfDatabaseEntries
    checkBase(arrayOfModels,arrayOfDatabaseEntries)


