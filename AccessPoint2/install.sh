#!/bin/bash

INSTALLED=$(cat ./installed)
echo "Instalacija potrebnog softvera"
echo "lighttpd"
sudo apt-get update
sudo apt-get install lighttpd

sudo chown www-data:www-data /var/www
sudo chmod 775 /var/www
sudo usermod -a -G www-data pi

echo "hostapd"
sudo apt-get install hostapd
sudo cp ./interfaces /etc/network/interfaces
sudo cp ./hostapd.conf /etc/hostapd/hostapd.conf
sudo cp ./hostapd /etc/default/hostapd

sudo service hostapd start
sudo service hostapd stop

echo "dnsmasq"
sudo apt-get install dnsmasq

sudo service dnsmasq start
sudo service dnsmasq restart


if [ $INSTALLED = 0 ] ; then
	echo "changing hosts"
	echo "172.26.1.1	eins" | sudo tee /etc/hosts
fi

echo "rebooting..."
sudo reboot
