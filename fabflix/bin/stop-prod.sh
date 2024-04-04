#!/bin/bash

# **WARNING** This will delete all containers and images
# Use to clean up the production server
set -e

sudo docker rm -f "$(sudo docker ps -aq)"
sudo docker rmi -f "$(sudo docker images -aq)"