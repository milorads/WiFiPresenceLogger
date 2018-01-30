#!/bin/bash

msgNoConnection="No connection to NTP time-server"
msgConnection="Connection to NTP time-server"

if( ntpq -p | grep -q "^*" );then
	#ima konekcije
	echo $msgConnection
	echo "-----------------"
	hwclock -f /dev/rtc1 -w
	#setovanje rtc registara
	#date +"%s" > i2cset 
	#i2cset -y 0 0x68 0x00 $(date +"%S") b
	#i2cset -y 0 0x68 0x01 $(date +"%M") b
	#i2cset -y 0 0x68 0x02 $(date +"%H") b
	#i2cset -y 0 0x68 0x04 $(date +"%d") b
	#i2cset -y 0 0x68 0x05 $(date +"%m") b
	#i2cset -y 0 0x68 0x06 $(date +"%y") b
	#i2cset -y 0 0x68 0x03 $(date +"%u") b

else
	#nema konekcije
	echo $msgNoConnection
	i2cdump -r 0-6 -y -f 0 0x68 b | grep -A10 : > rtc_dump.txt
	awk '{printf("20%s-%s-%s %s:%s:%s",$8,$7,$6,$4,$3,$2);}' < rtc_dump.txt > rtc_time.txt
	date -s $(date +'%Y-%m-%dT%H:%M:%S' -f rtc_time.txt)
	hwclock -s $(date +'%Y-%m-%dT%H:%M:%S' -f rtc_time.txt)
fi
