#!/bin/bash
# Fail if any command fails
set -e

APP_NAME="fabflix"

# Should run unit tests before build
docker build -t $APP_NAME .

# Get the current branch and commit hash
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
COMMIT_HASH=$(git rev-parse --short HEAD)


## Define the Docker image name and tag with branch and commit hash
DOCKER_USERNAME="anmho"
IMAGE_NAME="$APP_NAME:$CURRENT_BRANCH-$COMMIT_HASH"
IMAGE_TAG="$DOCKER_USERNAME/$IMAGE_NAME"

# Build the Docker image
docker build -t "$IMAGE_NAME" .
docker tag "$IMAGE_NAME" "$IMAGE_TAG"

docker push "$IMAGE_TAG"

# Push the Docker image to Docker Hub
echo "Docker image $IMAGE_TAG has been pushed to Docker Hub."

echo "$IMAGE_TAG" > image_tag.txt