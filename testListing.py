import time
import re
import subprocess
while 1:
    arp_out = subprocess.check_output(['arp','-i','wlan0'])

    print arp_out

    re_out = re.findall(r"((\w{2,2}\:{0,1}){6})", arp_out)

    print re_out
    
    time.sleep(5)

    #problems with scapy for python, trying python 3
import sys
from datetime import datetime
try:
    interface = input("enter iface")
    ips = input("ip range")
except KeyboardInterrupt:
    print
    'Requested shutdown'
    sys.exit(1)
try:
    from scapy import srp,Ether,ARP,conf
except ImportError:
    del scapy
    from scapy import all as scapy
conf.verb = 0
ans, unans = srp(Ether(dst="ff:ff:ff:ff:ff:ff")/ARP(pdst = ips), timeout = 2, iface = interface, inter =0.1)
# now read data and run this at interval
