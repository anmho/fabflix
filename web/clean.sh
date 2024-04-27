#!/bin/bash


# Run on production to clean 
sudo docker container stop web
sudo docker container --force prune
sudo docker image --force prune