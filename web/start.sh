#!/bin/bash

sudo docker stop web
sudo docker container prune
sudo docker image prune
sudo docker run -d -p 3000:3000 --name web web