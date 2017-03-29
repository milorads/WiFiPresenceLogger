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
sudo cp ./hostapd.conf /etc/hostapd/hostapd.conf
sudo cp ./hostapd /etc/default/hostapd
sudo cp ./dnsmasq.conf /etc/dnsmasq.conf

echo "Aktiviranje prosledjivanja interneta - ukoliko je prikacen ethernet-om"
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.conf
sudo sh -c "echo 1> /proc/sys/net/ipv4/ip_forward"

echo "Aktiviranje prosledjivanja interneta - enth->wlan0"
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT

echo "Aktivacija povracaja IP adresa na reboot-u"
sudo sed -i -e '$i iptables-restore < /etc/iptables.ipv4.nat  \n' /etc/rc.local

echo "Pokretanje servisa"
sudo service hostapd start
sudo service dnsmasq start
