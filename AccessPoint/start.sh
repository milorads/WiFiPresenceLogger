#!/bin/bash
# Start


#Pravljenje interfejsa
sudo iw phy phy0 interface add wlan0 type __ap

sudo ifconfig wlan0 down
#sudo ifconfig wlan0 hw ether 18:3F:47:95:DF:0B
sudo ifconfig wlan0 up

#Konfigurisanje wlan0
sudo ifconfig wlan0 172.16.0.1

# Ukljucivanje DHCP/DNS servera
sudo service dnsmasq restart

# Opciono - dodavanje routing-a ( internet passthrough sa etherneta)
sudo sysctl net.ipv4.ip_forward=1

# Ukljucivanje NAT-a
sudo iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE

# Pokretanje daemona
sudo hostapd /etc/hostapd.conf
