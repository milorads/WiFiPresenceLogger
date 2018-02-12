#!/bin/bash

msgNoConnection="No connection to NTP time-server"
msgConnection="Connection to NTP time-server"

if (ntpq -p | grep -q "^*");then
	#ima konekcije
	echo $msgConnection
	echo "-----------------"
	#setovanje rtc registara
	i2cset -y -f 0 0x68 0x00 0x$(date +"%S") b
	i2cset -y -f 0 0x68 0x01 0x$(date +"%M") b
	i2cset -y -f 0 0x68 0x02 0x$(date +"%H") b
	i2cset -y -f 0 0x68 0x04 0x$(date +"%d") b
	i2cset -y -f 0 0x68 0x05 0x$(date +"%m") b
	i2cset -y -f 0 0x68 0x06 0x$(date +"%y") b
	i2cset -y -f 0 0x68 0x03 0x$(date +"%u") b
else
	#nema konekcije
	echo $msgNoConnection
	i2cdump -r 0-6 -y 0 0x68 b | grep -A10 : > /home/admin/WiFiPresenceLogger/v2/rtc_dump.txt
	awk '{printf("20%s-%s-%s %s:%s:%s",$8,$7,$6,$4,$3,$2);}' < /home/admin/WiFiPresenceLogger/v2/rtc_dump.txt > /home/admin/WiFiPresenceLogger/v2/rtc_time.txt
	date -s $(date +'%Y-%m-%dT%H:%M:%S' -f /home/admin/WiFiPresenceLogger/v2/rtc_time.txt)
fi

