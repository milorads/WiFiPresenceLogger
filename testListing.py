import time
import re
import subprocess
while 1:
    arp_out = subprocess.check_output(['arp','-i','wlan0'])

    print arp_out

    re_out = re.findall(r"((\w{2,2}\:{0,1}){6})", arp_out)

    print re_out
    
    time.sleep(5)
