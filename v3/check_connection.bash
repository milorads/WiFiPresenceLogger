#!/bin/bash

online=2

while :; do
	if [ "$(timeout 2 ping -c 1 www.google.com)" ]; then
		if [ $online -ne 0 ]; then
			/home/admin/WiFiPresenceLogger/v2/ledon 1 g
			online=0
		fi
	else
		if [ $online -ne 1 ]; then
			/home/admin/WiFiPresenceLogger/v2/ledon 1 r
			online=1
		fi
	fi
	sleep 2
done
