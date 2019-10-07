#!/bin/bash

while !(mysqladmin ping --host=localhost --user=root --password=root > /dev/null 2>&1)
do
	sleep 3
done
