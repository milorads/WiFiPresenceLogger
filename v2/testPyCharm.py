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

text = "edge-mqtt-shv-01-vie1.facebook.com (31.13.84.2) at <incomplete> on wlan0\r\nedge-mqtt-mini-shv-01-sof1.facebook.com (157.240.9.32) at <incomplete> on wlan0\r\ngoogle-public-dns-a.google.com (8.8.8.8) at <incomplete> on wlan0\r\nandroid-c2b8e86149c2f024 (172.24.1.88) at e4:2d:02:4b:d7:5d [ether] on wlan0\r\nandroid-d63d9f42b4b94a1c (172.24.1.137) at 48:59:29:f5:bf:a9 [ether] on wlan0\r\nedge-mqtt-mini-shv-01-vie1.facebook.com (31.13.84.34) at <incomplete> on wlan0\r\nMarko-PC (172.24.1.143) at e4:b3:18:8d:27:5a [ether] on wlan0\r\n? (17.252.28.97) at <incomplete> on wlan0\r\nBOBINATOR (172.24.1.87) at b8:81:98:2a:f2:ce [ether] on wlan0\r\nec2-52-0-253-53.compute-1.amazonaws.com (52.0.253.53) at <incomplete> on wlan0\r\nandroid-5748cae99811896d (172.24.1.86) at <incomplete> on wlan0\r\nandroid-d4b79fedb3372143 (172.24.1.62) at <incomplete> on wlan0\r\nandroid-22eee753cab3bf15 (172.24.1.51) at <incomplete> on wlan0\r\nandroid-2f7afc7856aabec5 (172.24.1.54) at 90:5f:2e:52:95:04 [ether] on wlan0\r\nec2-34-240-79-136.eu-west-1.compute.amazonaws.com (34.240.79.136) at <incomplete> on wlan0\r\nInspiron-b02 (172.24.1.148) at ac:7b:a1:28:a2:2b [ether] on wlan0\r\ngateway (192.168.1.2) at 54:04:a6:5e:f5:04 [ether] on eth0\r\n? (17.252.28.30) at <incomplete> on wlan0"
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