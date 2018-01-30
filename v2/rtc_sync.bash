#!/bin/bash

msgNoConnection="No connection to NTP time-server"
msgConnection="Connection to NTP time-server"

#provera da li ntpq radi
if( ntpq -p | grep -q "^*" );then
	#ima konekcije
	echo $msgConnection
	echo "-----------------"
	#setovanje rtc registara preko hwclock-a 
    echo ds3231 0x68 > /sys/class/i2c-adapter/i2c-0/new_device
	
	
	hwclock -f /dev/rtc1 -w
	
	
	#date +"%s" > i2cset 
	#i2cset -y 0 0x68 0x00 $(date +"%S") b
	#i2cset -y 0 0x68 0x01 $(date +"%M") b
	#i2cset -y 0 0x68 0x02 $(date +"%H") b
	#i2cset -y 0 0x68 0x04 $(date +"%d") b
	#i2cset -y 0 0x68 0x05 $(date +"%m") b
	#i2cset -y 0 0x68 0x06 $(date +"%y") b
	#i2cset -y 0 0x68 0x03 $(date +"%u") b

else
	#nema konekcije, upisuje se sa rtc-a u sistemsko vreme
	echo $msgNoConnection
	i2cdump -r 0-6 -y -f 0 0x68 b | grep -A10 : > rtc_dump.txt
	awk '{printf("20%s-%s-%s %s:%s:%s",$8,$7,$6,$4,$3,$2);}' < rtc_dump.txt > rtc_time.txt
	date -s $(date +'%Y-%m-%dT%H:%M:%S' -f rtc_time.txt)
	hwclock -s $(date +'%Y-%m-%dT%H:%M:%S' -f rtc_time.txt)
fi
