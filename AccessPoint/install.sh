#!/bin/bash

echo "Instalacija potrebnog softvera ( hostapd & dnsmasq )"
sudo apt-get install hostapd dnsmasq -y

echo 'Preusmjeravanje interfejsa'
echo "denyinterfaces wlan0" | sudo tee /etc/dhcpd.conf -a

echo "Applying static IP for the access point and restarting the service"
sudo cp ./interfaces /etc/network/interfaces
sudo service dhcpd restart
sudo ifdown wlan0; sudo ifup wlan0



echo "Kopiranje konfiguracionih fajlova"
sudo cp ./hostapd.conf /etc/hostapd.conf
sudo cp ./dnsmasq.conf /etc/dnsmasq.conf
