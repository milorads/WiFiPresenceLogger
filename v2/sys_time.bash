#!/bin/bash
#Shell skripta za podesavanje vremena na rosberry-ju i na hardverskom RTC-u
# kao prvi argument ($1) ocekuje kod akcije: 0, 1, 2, 3
# Drugi argument ($2) je admin vreme u formatu YYYY-MM-dd HH:mm:SS.dddddd
case "$1" in
	0)
		#Kod 0 - Podesavanje sistemskog vremena i RTC vremena u odnosu na sistemsko vreme sa racunara administratora
		
		echo "code 0: setovanje sistemskog vremena i rtc-a sa administratorske aplikacije"
		#format je '2018-05-15 11:05:28.081730'
		echo $2
		date -s $2
		i2cset -y -f 1 0x68 0x00 0x$(date +"%S") b
		i2cset -y -f 1 0x68 0x01 0x$(date +"%M") b
		i2cset -y -f 1 0x68 0x02 0x$(date +"%H") b
		i2cset -y -f 1 0x68 0x04 0x$(date +"%d") b
		i2cset -y -f 1 0x68 0x05 0x$(date +"%m") b
		i2cset -y -f 1 0x68 0x06 0x$(date +"%y") b
		i2cset -y -f 1 0x68 0x03 0x$(date +"%u") b
		;;
		
	1)
		#Kod 1: Podesavanje sistemskog vremena u odnosu na RTC, ne gleda se administratorsko vreme (drugi paametar)
		echo "code 1: setovanje sistemskog vremena sa rtc-a"
		i2cdump -r 0-6 -y 1 0x68 b | grep -A10 : > /home/admin/WiFiPresenceLogger/v2/rtc_dump.txt
		awk '{printf("20%s-%s-%s %s:%s:%s",$8,$7,$6,$4,$3,$2);}' < /home/admin/WiFiPresenceLogger/v2/rtc_dump.txt > /home/admin/WiFiPresenceLogger/v2/rtc_time.txt
		date -s $(date +'%Y-%m-%dT%H:%M:%S' -f /home/admin/WiFiPresenceLogger/v2/rtc_time.txt)
		;;
	2)
		#Kod 2: Podesavanje vremena na RTC-u u odnosu na Sistemsko vreme, ne gleda se administratorsko vreme (drugi paametar)
		echo "code 2: setovanje rtc-a sa sistemskog vremena"
		i2cset -y -f 1 0x68 0x00 0x$(date +"%S") b
		i2cset -y -f 1 0x68 0x01 0x$(date +"%M") b
		i2cset -y -f 1 0x68 0x02 0x$(date +"%H") b
		i2cset -y -f 1 0x68 0x04 0x$(date +"%d") b
		i2cset -y -f 1 0x68 0x05 0x$(date +"%m") b
		i2cset -y -f 1 0x68 0x06 0x$(date +"%y") b
		i2cset -y -f 1 0x68 0x03 0x$(date +"%u") b
		;;
	3)
		#Kod 3: Proverava se Internet konekcija, ako je ima, Uzima se vreme sa NTP servera i setuje se RTC vreme (Sistemsko ce se automatski setovati)
		#Ako nema, setuje se Sistemsko vreme sa RTC-a
		msgNoConnection="No connection to NTP time-server"
		msgConnection="Connection to NTP time-server"
			
		if [ "$(ping -c 1 google.com)" ];then
			#ima konekcije
			echo $msgConnection
			echo "-----------------"
			sudo /etc/init.d/ntp stop && sudo ntpd -gq && sudo /etc/init.d/ntp restart
			#setovanje rtc registara
			i2cset -y -f 1 0x68 0x00 0x$(date +"%S") b
			i2cset -y -f 1 0x68 0x01 0x$(date +"%M") b
			i2cset -y -f 1 0x68 0x02 0x$(date +"%H") b
			i2cset -y -f 1 0x68 0x04 0x$(date +"%d") b
			i2cset -y -f 1 0x68 0x05 0x$(date +"%m") b
			i2cset -y -f 1 0x68 0x06 0x$(date +"%y") b
			i2cset -y -f 1 0x68 0x03 0x$(date +"%u") b
		else
			#nema konekcije
			echo $msgNoConnection
			i2cdump -r 0-6 -y 1 0x68 b | grep 00: > /home/admin/WiFiPresenceLogger/v2/rtc_dump.txt
			awk '{printf("20%s-%s-%s %s:%s:%s",$8,$7,$6,$4,$3,$2);}' < /home/admin/WiFiPresenceLogger/v2/rtc_dump.txt > /home/admin/WiFiPresenceLogger/v2/rtc_time.txt
			date -s $(date +'%Y-%m-%dT%H:%M:%S' -f /home/admin/WiFiPresenceLogger/v2/rtc_time.txt)
		fi
		;;
	*)
		#Nema koda, nepoznata operacija, ne radi nista
		echo "code unknown"
esac

