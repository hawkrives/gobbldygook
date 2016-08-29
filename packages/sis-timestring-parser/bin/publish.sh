#!/bin/bash

set -e

git pull --rebase

npm test

echo ""
node -e "var p=require('./package.json');console.log(p.name+': '+p.version)"
echo ""

read -rp "New Version [major|minor|patch]: " version
npm version "$version"

npm run build
npm publish
npm run clean

git push --follow-tags
