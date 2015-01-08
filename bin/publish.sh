#!/bin/sh

git pull --rebase

npm run build

node ./version.js

read -p "New Version [Major|Minor|Patch]: " version
npm version $version

# npm publish

# git push --follow-tags
