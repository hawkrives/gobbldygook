#!/bin/sh

git pull --rebase

npm test

echo ""
node ./bin/version.js
echo ""

read -p "New Version [major|minor|patch]: " version
npm version $version

npm publish

git push --follow-tags
