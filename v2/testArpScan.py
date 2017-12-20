import time
import subprocess
import re


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

arpl =  subprocess_cmd("arp -a | grep 'wlan0' | grep -v '<unknown>'")

arp_array = arpl.splitlines()

arrayOfModels = list()

for i in arp_array:
        pom = i.split()
        pom[1] = re.sub('[()]','',pom[1])
	currentModel = ArpModel(pom[1],pom[3],pom[0])
	arrayOfModels.append(currentModel)

for model in arrayOfModels:
	print model.GetIp()
	print model.GetMac()
	print model.GetHost()	