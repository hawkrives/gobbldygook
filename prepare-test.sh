#!/bin/bash

node node_modules/.bin/6to5 __tests__ -d testing/__tests__
node node_modules/.bin/6to5 app       -d testing/app
node node_modules/.bin/6to5 mockups   -d testing/mockups

for file in `find ./testing -name '*.es6'`; do
	outname=`echo "$file" | sed 's/\.es6/.js/'`;
	mv "$file" "$outname";
done;
