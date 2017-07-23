#from scapy.all import srp,Ether,ARP,conf
import sys
from datetime import datetime
try:
    interface = raw_input("enter iface")
    ips = raw
try:
    from scapy import srp,Ether,ARP,conf
except ImportError:
    del scapy
    from scapy import all as scapy
conf.verb = 0
ans, unans = srp(Ether(dst="ff:ff:ff:ff:ff:ff"))/ARP, timeout = 2, iface = interface, inter =0.1

