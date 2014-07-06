#!/bin/sh

node server.js &> node-output.log &
sass --watch public/css/app.scss:public/css/app.css &> sass-output.log &
