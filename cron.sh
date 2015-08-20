#!/bin/bash

# exit if any commands error
set -e

# update the code
git pull origin master

# install any updated dependencies
npm i --no-progress

# run the tests
npm test

# build
npm run build
