import time
import re
import subprocess
counter = 1;
while 1:
    arp_out = subprocess.check_output(['arp','-i','wlan0'])

    print arp_out

    re_out = re.findall(r"((\w{2,2}\:{0,1}){6})", arp_out)

    print re_out

    #sudo ip -s -s neigh flush all
    #subprocess.call('sudo ip -s -s neigh flush all', shell=True)
    #flushing might not work perfectly so trying to flush every 30 sec
    if (counter%6 == 0):
        subprocess.call('sudo ip -s -s neigh flush all', shell=True)

    counter+=1
    time.sleep(5)
