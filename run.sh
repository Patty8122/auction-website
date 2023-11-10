#!/bin/bash

# Stop all containers
docker-compose down

# Build the images and start the containers
# The --build flag ensures that images are built with the latest changes
# The --remove-orphans flag removes containers for services that are no longer defined
# The -d flag starts the containers in detached mode (in the background)
docker-compose -f docker-compose.yml up --build --remove-orphans -d
