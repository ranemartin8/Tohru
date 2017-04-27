#!/bin/bash

docker-compose down
docker-compose pull
docker-compose up --no-deps -d
