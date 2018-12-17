#!/usr/bin/env bash

cd ..

docker build -t knrt10/hasura -f Dockerfile .

docker-compose up -d
