#!/usr/bin/env bash
# inspired by https://gist.github.com/maxrimue/16e272c4e0b8a8ac9dd5570e180e08c0
# taken from https://github.com/devtools-html/debugger.html/blob/master/bin/update-yarn-lock-file

# this script is only for CircleCI
$CI || exit 0

if [[ $TRAVIS_BRANCH != *"greenkeeper"* ]]; then
  # Not a GreenKeeper Pull Request, aborting
  exit 0
fi

# See if commit message includes "update"
git log --name-status HEAD^..HEAD | grep "update" || exit 0

# only continue if yarn needs to update
yarn check || exit 0

# Run yarn to create/update lockfile
yarn

# Commit and push yarn.lock file
git config user.email "travis-ci@users.noreply.github.com"
git config user.name "travis-ci"
git config push.default simple

git add yarn.lock
git commit -m "chore: update yarn.lock"
git push origin "$TRAVIS_BRANCH"
