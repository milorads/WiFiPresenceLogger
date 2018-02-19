#!/bin/bash

INSTALLED=$(cat /home/admin/WiFiPresenceLogger/v2/AccessPoint/installed)
if (INSTALLED==1);then
	exit 1
else
	INSTALLED=1
	INSTALLED > /home/admin/WiFiPresenceLogger/v2/AccessPoint/installed
fi

ETHERNET_CONNECTED=
echo "Access point installation (make sure you have ethernet connected fo eveything to work properly)"

read -p "Is ethernet connected? (y/n)"  ethConn
if echo "$ethConn" | grep -iq "^y" ;then
    echo "Proceeding with installation."
else
    exit 1
fi

echo "Updating system."
sudo apt-get update
sudo apt-get install
sudo dpkg --configure -a
sudo apt-get install
sudo apt-get upgrade

echo "Installing hostapd, dnsmasq and dhcpd."
sudo apt-get install dnsmasq hostapd dhcpd dhcpcd5

#kompiranje i pravljenje backup fajla  /boot/armbianEnv.txt pa reboot

echo "Checking for existing interfaces configuration and backing up if existent"
sudo mv /etc/network/interfaces /etc/network/interfaces.backup
echo "Installing required interfaces configuration"
sudo cp /home/admin/WiFiPresenceLogger/v2/AccessPoint/interfaces /etc/network/

echo "Checking for existing hostapd configuration and backing up if existent"
sudo mv /etc/hostapd/hostapd.conf /etc/hostapd/hostapd.conf.backup
echo "Installing required hostapd configuration"
sudo cp /home/admin/WiFiPresenceLogger/v2/AccessPoint/hostapd.conf /etc/hostapd/

echo "Checking for existing configuration pointer file and backing up if existent"
sudo mv /etc/default/hostapd /etc/default/hostapd.backup
echo "Installing required conf pointer configuration"
sudo cp /home/admin/WiFiPresenceLogger/v2/AccessPoint/hostapd /etc/default/

echo "Checking for existing dnsmasq configuration file and backing up if existent"
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.backup
echo "Installing required conf pointer configuration"
sudo cp /home/admin/WiFiPresenceLogger/v2/AccessPoint/dnsmasq.conf /etc/

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
sudo cp /home/admin/WiFiPresenceLogger/v2/AccessPoint/rc.local /etc/


echo "Installing sqlite3."
sudo apt-get install sqlite3

echo "Installing node-legacy."
sudo apt-get install nodejs-legacy

echo "Installing npm."
sudo apt-get install npm

echo "Installing node-sqlite3."
npm i sqlite3 --build-from-source

echo "Installing node-express."
sudo npm install express

echo "Installing i2c-tools."
sudo apt install i2c-tools

#enabling i2c-tools
#kompiranje i pravljenje backup fajla  /boot/armbianEnv.txt pa reboot
echo "Checking for existing interfaces configuration and backin up if exist"
sudo mv /boot/armbianEnv.txt /boot/armbianEnv.backup.txt
echo "Installing required armbianEnv.txt configuration"
sudo cp /home/admin/WiFiPresenceLogger/v2/AccessPoint/armbianEnv.txt /boot/




echo "Synchronising real time clock."
msgNoConnection="No connection to NTP time-server"
msgConnection="Connection to NTP time-server"

if (ntpq -p | grep -q "^*");then
	#ima konekcije
	echo $msgConnection
	echo "-----------------"
	#setovanje rtc registara
	i2cset -y -f 0 0x68 0x00 0x$(date +"%S") b
	i2cset -y -f 0 0x68 0x01 0x$(date +"%M") b
	i2cset -y -f 0 0x68 0x02 0x$(date +"%H") b
	i2cset -y -f 0 0x68 0x04 0x$(date +"%d") b
	i2cset -y -f 0 0x68 0x05 0x$(date +"%m") b
	i2cset -y -f 0 0x68 0x06 0x$(date +"%y") b
	i2cset -y -f 0 0x68 0x03 0x$(date +"%u") b
else
	#nema konekcije
	echo $msgNoConnection
	i2cdump -r 0-6 -y 0 0x68 b | grep -A10 : > /home/admin/WiFiPresenceLogger/v2/rtc_dump.txt
	awk '{printf("20%s-%s-%s %s:%s:%s",$8,$7,$6,$4,$3,$2);}' < /home/admin/WiFiPresenceLogger/v2/rtc_dump.txt > /home/admin/WiFiPresenceLogger/v2/rtc_time.txt
	date -s $(date +'%Y-%m-%dT%H:%M:%S' -f /home/admin/WiFiPresenceLogger/v2/rtc_time.txt)
fi
echo "Successful synchronising."

echo "Rebooting system."
sudo reboot