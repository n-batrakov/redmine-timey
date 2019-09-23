#!/bin/bash

set -e

rm -rf ./dist

npm ci
npm run test
npm run build

sudo docker build -t nbatrakov/redmine-timey .
sudo docker push nbatrakov/redmine-timey