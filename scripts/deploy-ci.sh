#!/bin/bash -ve

DEST_BRANCH=gh-pages

# prepare the gh-pages branch
git checkout -B $DEST_BRANCH --no-track

rm -rf bin/ config/ flow-typed/ modules/ playground/ screenshots/ scripts/
find ./ -type f -depth 1 -not -name '.git*' -not -name package.json -delete
mv build/* ./
rm -f build/.DS_Store
rmdir build/

# and … push
git add --all ./
git commit -m "build app" --quiet
git push -f "https://github.com/hawkrives/gobbldygook.git" $DEST_BRANCH
curl -d "apiKey=7e393deddaeb885f5b140b4320ecef6b" -d "repository=https://github.com/hawkrives/gobbldygook" -d "revision=$(git rev-parse --verify HEAD)" 'https://notify.bugsnag.com/deploy'
