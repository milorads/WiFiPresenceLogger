#!/bin/bash

# Iskljucivanje NAT
sudo iptables -D POSTROUTING -t nat -o ppp0 -j MASQUERADE

# Zaustavljanje rutiranja
sudo sysctl net.ipv4.ip_forward=0

# Iskljucivanje DHCP/DNS servera
sudo service dnsmasq stop
sudo service hostapd stop

# Unistavanje interfejsa
sudo iw dev ap0 del
