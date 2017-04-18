#!/bin/bash

INSTALLED=$(cat ./installed)
echo "Instalacija potrebnog softvera ( lighttpd, hostapd & dnsmasq )"
sudo apt-get update
sudo apt-get install lighttpd

sudo chown www-data:www-data /var/www
sudo chmod 775 /var/www
sudo usermod -a -G www-data pi

sudo apt-get install hostapd
sudo cp ./interfaces /etc/network/interfaces

