import re

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

class LoggerLevel:
    def __init__(self):
        pass

    @staticmethod
    def severity():
        global_severity = 1
        # 1 - Trace, 2 - Info, 3 - Warning, 4 - Error
        return global_severity


def log(severity, message, exception = None):
    print LoggerLevel.severity()
    if severity >= LoggerLevel.severity():
        print(message)
        if exception is not None:
            print exception.message


log(1,"=-=-=--=")
log(4,"31232132",Exception("dsadasd"))

text = "gateway (192.168.1.2) at 54:04:a6:5e:f5:04 [ether] on eth0\r\nandroid-79da20a41db6bfef (172.24.1.131) at <incomplete> on wlan0\r\nInspiron-b02 (172.24.1.148) at ac:7b:a1:28:a2:2b [ether] on wlan0\r\nandroid-fd21e09fb1676301 (172.24.1.120) at 20:64:32:41:4a:16 [ether] on wlan0\r\n"
regExpression = r'(?P<host>([^\s]+))[\s][(](?P<ip>\b(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}\b)[)][\s][aA][tT][\s](?P<mac>((\d|([a-f]|[A-F])){2}:){5}(\d|([a-f]|[A-F])){2})(([\s][\[][eE][tT][hH][eE][rR][\]][\s][oO][nN][\s])|([\s][oO][nN][\s]))(?P<iface>.*)\r'

pairOfMacArpModel = {}

pattern = re.compile(regExpression)
presentDevices = [m.groupdict() for m in pattern.finditer(text)]

for obj in presentDevices:
    if "wlan0" not in obj["iface"]:
        continue
    pairOfMacArpModel[obj["mac"]]= ArpModel(obj["ip"],obj["mac"],obj["host"])
    print(pairOfMacArpModel[obj["mac"]])
    print(pairOfMacArpModel[obj["mac"]].GetId())
    print(pairOfMacArpModel[obj["mac"]].GetIp())
    print(pairOfMacArpModel[obj["mac"]].GetMac())
    print(pairOfMacArpModel[obj["mac"]].GetHost())

