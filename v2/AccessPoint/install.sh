#!/bin/bash

INSTALLED=$(cat ./installed)
ETHERNET_CONNECTED=
echo "Access point installation (make sure you have ethernet connected fo eveything to work properly)"

read -p "Is ethernet connected? (y/n)"  ethConn
if echo "$ethConn" | grep -iq "^y" ;then
    echo "Proceeding with installation."
else
    exit 1
fi

echo "Installing hostapd, dnsmasq and dhcpd."
sudo apt-get install dnsmasq hostapd dhcpd dhcpcd5

echo "Checking for existing interfaces configuration and backing up if existent"
sudo mv /etc/network/interfaces /etc/network/interfaces.backup
echo "Installing required interfaces configuration"
sudo cp interfaces /etc/network/

echo "Checking for existing hostapd configuration and backing up if existent"
sudo mv /etc/hostapd/hostapd.conf /etc/hostapd/hostapd.conf.backup
echo "Installing required hostapd configuration"
sudo cp hostapd.conf /etc/hostapd/

echo "Checking for existing configuration pointer file and backing up if existent"
sudo mv /etc/default/hostapd /etc/default/hostapd.backup
echo "Installing required conf pointer configuration"
sudo cp hostapd /etc/default/

echo "Checking for existing dnsmasq configuration file and backing up if existent"
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.backup
echo "Installing required conf pointer configuration"
sudo cp dnsmasq.conf /etc/

echo "Enabling ip forwarding"
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.conf

echo "Enabling eth0 <-> wlan0 ip forwarding"
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE  
sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT  
sudo iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT  

echo "Saving forwarding configuration"
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"

echo "Checking for existing rc.local file and backing up if existent"
sudo mv /etc/rc.local /etc/rc.local.backup
echo "Installing forwarding on boot"
sudo cp rc.local /etc/