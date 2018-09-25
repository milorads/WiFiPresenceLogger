#!/bin/bash

echo "Access point installation (make sure you have ethernet connected fo eveything to work properly)"

read -p "Is ethernet connected? (y/n)"  ethConn
if echo "$ethConn" | grep -iq "^y" ;then
    echo "Proceeding with installation."
else
    exit 1
fi

echo "[*INFO] Upgrading system"
apt-get update
apt-get -y upgrade


echo "[*INFO] Installing hostapd, dnsmasq and dhcpd."
sudo apt-get install -y dnsmasq hostapd dhcpd dhcpcd5

echo "[*INFO] Checking for existing interfaces configuration and backing up if existent"
sudo mv /etc/network/interfaces /etc/network/interfaces.backup
echo "[*INFO] Installing required interfaces configuration"
sudo cp /home/admin/WiFiPresenceLogger/v3/AccessPoint/interfaces /etc/network/

echo "[*INFO] Checking for existing hostapd configuration and backing up if existent"
sudo mv /etc/hostapd/hostapd.conf /etc/hostapd/hostapd.conf.backup
echo "[*INFO] Installing required hostapd configuration"
sudo cp /home/admin/WiFiPresenceLogger/v3/AccessPoint/hostapd.conf /etc/hostapd/

echo "[*INFO] Checking for existing configuration pointer file and backing up if existent"
sudo mv /etc/default/hostapd /etc/default/hostapd.backup
echo "[*INFO] Installing required conf pointer configuration"
sudo cp /home/admin/WiFiPresenceLogger/v3/AccessPoint/hostapd /etc/default/

echo "[*INFO] Checking for existing dnsmasq configuration file and backing up if existent"
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.backup
echo "[*INFO] Installing required conf pointer configuration"
sudo cp /home/admin/WiFiPresenceLogger/v3/AccessPoint/dnsmasq.conf /etc/

echo "[*INFO] Checking for existing dhcpcd.conf configuration file and backing up if existent"
sudo mv /etc/dhcpcd.conf /etc/dhcpcd.conf.backup
echo "[*INFO] Installing required conf pointer configuration"
sudo cp /home/admin/WiFiPresenceLogger/v3/AccessPoint/dhcpcd.conf /etc/



echo "[*INFO] Enabling ip forwarding"
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.conf

echo "[*INFO] Enabling eth0 <-> wlan0 ip forwarding"
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE  
sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT  
sudo iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT  

echo "[*INFO] Saving forwarding configuration"
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"

echo "[*INFO] Checking for existing rc.local file and backing up if existent"
sudo mv /etc/rc.local /etc/rc.local.backup
echo "[*INFO] Installing forwarding on boot"
sudo cp /home/admin/WiFiPresenceLogger/v3/AccessPoint/rc.local /etc/

chmod +x /etc/rc.local

echo "[*INFO] Intalling sqlite3."
apt-get install sqlite3


echo "[*INFO] Download and setup the APT repository for nodejs"
curl -sL https://deb.nodesource.com/setup_6.x | bash -

echo "[*INFO] Installing nodejs & npm"
apt-get install -y nodejs

echo "[*INFO] Upgrading npm"
npm install npm --global

echo "[*INFO] Installing express package"
npm install express

echo "[*INFO] Installing sqlite3 package"
npm install sqlite3

echo "[*INFO] Installing i2c-tools"
apt install i2c-tools


