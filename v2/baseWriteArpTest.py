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
    def __init__(self, ip, mac, host = "Unknown", identifier = -1):
        #Constructor with host name defaulted to Unknown in case it cannot be parsed
        self.hostName = host
        self.ipAddress = ip
        self.macAddress = mac
        self.id = identifier
    def GetIp(self):
	return (self.ipAddress)
    def GetMac(self):
	return (self.macAddress)
    def GetHost(self):
	return (self.hostName)
    def GetId(self):
        return (self.id)
    pass

def subprocess_cmd(command):
    output = subprocess.check_output(command,shell = True)
    return output

def checkBase(macArpPair,tableName):
    conn = sqlite3.connect("LogBase.db")
    cursor = conn.cursor()
    sql = "SELECT * FROM " + tableName + " WHERE Izlaz IS NULL"
    cursor.execute(sql)
    dbRecords = cursor.fetchall()
    if len(rows) == 0:
        print("no items")
    else:
        macDbPairs = {}
        for record in dbRecords:
            currentModel = ArpModel(record[2],record[1],"Unknown", record[0])
            macDbPairs[record[1]]=currentModel
        currentDateTime = datetime.now()
        for arpMac, arpObject in macArpPair.iteritems():
            if arpMac not in macDbPairs:
                cursor.execute(addNewPersonSQL,[arpObject.GetIp(),arpObject.GetMac(),currentDateTime,None])
                conn.commit()
        for dbMac, dbObject in macDbPairs.iteritems():
            if dbMac not in macArpPair:
                cursor.execute(updateExistingPersonSQL, [currentDateTime, dbObject.GetId()])
                conn.commit()
    conn.close()

def addToBase(macArpPair,tableName):
	conn = sqlite3.connect("LogBase.db")
	cursor = conn.cursor()
	sql ="INSERT INTO "+tableName + " (Ip,Mac,Ulaz,Izlaz) VALUES(?,?,?,?)"
	dTime = datetime.now()
	for key, i in macArpPair.iteritems():
		cursor.execute(sql,[i.GetIp(),i.GetMac(),dTime,None])
		conn.commit()
	conn.close()

#cleanup = subprocess_cmd("sudo ip -s -s neigh flush all', shell=True")
try:
    subprocess.call("sudo ./flushArp.sh", shell = True)
except Exception, e:
    print("error")
time.sleep(3)
try:
    arpl =  subprocess_cmd("arp -a | grep 'wlan0' | grep -v '<unknown>\|<incomplete>'")
except Exception, e:
    print("error")
arp_array = arpl.splitlines()
pairOfMacArpModel = {}

for i in arp_array:
    pom = i.split()
    pom[1] = re.sub('[()]','',pom[1])
    currentModel = ArpModel(pom[1],pom[3],pom[0])
    pairOfMacArpModel[pom[3]]=currentModel

tableName = "T"+datetime.now().strftime('%d_%m_%y')
conn = sqlite3.connect("LogBase.db")
cursor = conn.cursor() 
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (tableName,))
rows = cursor.fetchall()
if len(rows) == 0:
    #create table + write all from models
    cursor.execute("CREATE TABLE " + tableName + " (LogBaseId integer PRIMARY KEY NOT NULL UNIQUE,Mac TEXT,Ip TEXT,Ulaz DATETIME,Izlaz DATETIME)")
    conn.close()
    addToBase(pairOfMacArpModel,tableName)
else:
    conn.close()
    checkBase(pairOfMacArpModel,tableName)