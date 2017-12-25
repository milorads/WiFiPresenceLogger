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
                addNewPersonSQL = "INSERT INTO "+tableName + " (Ip,Mac,Ulaz,Izlaz) VALUES(?,?,?,?)"
                cursor.execute(addNewPersonSQL,[arpObject.GetIp(),arpObject.GetMac(),currentDateTime,None])
                conn.commit()
        for dbMac, dbObject in macDbPairs.iteritems():
            if dbMac not in macArpPair:
                updateExistingPersonSQL = "UPDATE "+tableName+" SET Izlaz =? WHERE LogBaseId =?"
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

try:
    arpCall =  subprocess_cmd("arp -a")
except Exception, e:
    print("Error in arp table fetching")
regExpression = r'(?P<host>([^\s]+))[\s][(](?P<ip>\b(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}\b)[)][\s][aA][tT][\s](?P<mac>((\d|([a-f]|[A-F])){2}:){5}(\d|([a-f]|[A-F])){2})(([\s][\[][eE][tT][hH][eE][rR][\]][\s][oO][nN][\s])|([\s][oO][nN][\s]))(?P<iface>.*)\r'
pairOfMacArpModel = {}

pattern = re.compile(regExpression)
presentDevices = [m.groupdict() for m in pattern.finditer(arpCall)]

for obj in presentDevices:
    if "wlan0" not in obj["iface"]:
        continue
    pairOfMacArpModel[obj["mac"]]= ArpModel(obj["ip"],obj["mac"],obj["host"])

try:
    tableName = "T"+datetime.now().strftime('%d_%m_%y')
    conn = sqlite3.connect("LogBase.db")
    cursor = conn.cursor() 
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (tableName,))
    rows = cursor.fetchall()
except Exception, e:
    print("Error in getting the table name")
if len(rows) == 0:
    try:
        cursor.execute("CREATE TABLE " + tableName + " (LogBaseId integer PRIMARY KEY NOT NULL UNIQUE,Mac TEXT,Ip TEXT,Ulaz DATETIME,Izlaz DATETIME)")
        conn.close()
        addToBase(pairOfMacArpModel,tableName)
    except Exception, e:
        print("Error in Table Create or add to base")
else:
    try:
        conn.close()
        checkBase(pairOfMacArpModel,tableName)
    except Exception, e:
        print("Error in Check Base")
