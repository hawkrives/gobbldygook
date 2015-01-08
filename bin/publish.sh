#!/bin/sh

git pull --rebase

npm run build

grep "version" package.json

read -p "Version: "  version; \
npm version $version --message "v%s"
# npm publish

git push --follow-tags
