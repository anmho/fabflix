#!/bin/bash


# Run on production to clean 
sudo docker container stop web
sudo docker container prune --force
sudo docker image prune --force 