#!/bin/bash

sudo rm /var/lib/tomcat10/webapps/api.war
sudo rm -rf /var/lib/tomcat10/webapps/api

./mvnw install
./mvnw clean package

mv ./target/fabflix-1.0-SNAPSHOT.war ./target/api.war
sudo cp ./target/api.war /var/lib/tomcat10/webapps/

sudo systemctl restart tomcat10