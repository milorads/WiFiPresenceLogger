#!/bin/bash

online=0
/home/admin/WiFiPresenceLogger/v2/ledon 1 r

while :; do
	if [ "$(ping -c 1 www.google.com)" ]; then
		if [ $online -eq 0 ]; then
			/home/admin/WiFiPresenceLogger/v2/ledon 1 g
			online=1
		fi
	else
		if [ $online -eq 1 ]; then
			/home/admin/WiFiPresenceLogger/v2/ledon 1 r
			online=0
		fi
		sleep 3
	fi
done
