#!/usr/bin/env bash

cd ..

docker build -t knrt10/todoapi -f Dockerfile .

docker-compose up -d
