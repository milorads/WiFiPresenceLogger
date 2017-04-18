#!/bin/bash

INSTALLED=$(cat ./installed)
echo "Instalacija potrebnog softvera"

echo "update apt-get"
sudo apt-get update

echo "lighttpd"
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
	sudo sed -i -e '192.168.3.1	eins  \n' /etc/hosts
fi

echo '1' > ./installed

echo "rebooting..."
sudo reboot
