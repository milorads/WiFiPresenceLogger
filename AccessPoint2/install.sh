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
sudo cp ./dnsmasq.conf /etc/dnsmasq.conf

sudo service dnsmasq start
sudo service dnsmasq restart


if [ $INSTALLED = 0 ] ; then
	echo "changing hosts"
	sudo sed -i -e '192.168.3.1	eins  \n' /etc/hosts
fi

sudo iptables -t nat -A PREROUTING -d 0/0 -p tcp --dport 80 -j DNAT --to-destination 192.168.3.1
sudo iptables -t nat -A PREROUTING -d 0/0 -p tcp --dport 443 -j DNAT --to-destination 192.168.3.1

echo '1' > ./installed

echo "rebooting..."
#!sudo reboot
