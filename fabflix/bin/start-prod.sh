#!/bin/bash
# Starts up the docker container on the prod webserver
# Must create .env on prod webserver
# Load the environment variables
set -e

sudo apt update
sudo apt install docker.io

if [[ -z "${IMAGE_TAG}" ]]; then
  echo "IMAGE_TAG is not set"
  exit 1
fi

cat .env
echo $IMAGE_TAG

IMAGE=anmho/fabflix:$IMAGE_TAG
echo $IMAGE

sudo docker pull $IMAGE

sudo docker run \
 --env-file .env \
 -p 8080:8080 \
 --name fabflix \
 -d \
 $IMAGE

