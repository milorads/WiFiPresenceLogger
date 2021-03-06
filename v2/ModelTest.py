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

modeli = {
    ArpModel("ip1","mac1","host1"),
    ArpModel("ip2","mac2","host1"),
    ArpModel("ip3","mac3")
}

def checkBase(listOfModels):
    for model in listOfModels:
        print model.GetIp()
        print model.GetMac()
	print model.GetHost()

checkBase(modeli)