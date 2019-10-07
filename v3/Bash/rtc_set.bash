#!/bin/bash

sudo date -s "$(wget -qSO- --max-redirect=0 google.com 2>&1 | grep Date: | cut -d' ' -f5-8)Z"
echo "Setovanje vremena"
i2cset -y -f 1 0x68 0x00 0x$(date +"%S") b
i2cset -y -f 1 0x68 0x01 0x$(date +"%M") b
i2cset -y -f 1 0x68 0x02 0x$(date +"%H") b
i2cset -y -f 1 0x68 0x04 0x$(date +"%d") b
i2cset -y -f 1 0x68 0x05 0x$(date +"%m") b
i2cset -y -f 1 0x68 0x06 0x$(date +"%y") b
i2cset -y -f 1 0x68 0x03 0x$(date +"%u") b
echo "Uspesno setovanje"