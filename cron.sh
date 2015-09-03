#!/bin/bash

# exit if any commands error
set -e

PATH=/home/users/rives/bin/:$PATH

# update the code
git pull origin master

# install any updated dependencies
npm i --no-progress > /dev/null

# run the tests
npm test
npm run test:students

# build
npm run build:ci
