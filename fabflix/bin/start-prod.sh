#!/bin/bash
# Starts up the docker container on the prod webserver
# Must create .env on prod webserver
# Load the environment variables
set -e

if [[ -z "${IMAGE_TAG}" ]]; then
  echo "IMAGE_TAG is not set"
  exit 1
fi

cat .env
echo $IMAGE_TAG

IMAGE=anmho/fabflix:$IMAGE_TAG
echo $IMAGE

docker pull $IMAGE

docker run \
 --env-file .env \
 -p 8080:8080 \
 $IMAGE

