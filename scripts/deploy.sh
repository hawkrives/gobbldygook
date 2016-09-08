#!/bin/bash -ve

SOURCE_BRANCH=master
DEST_BRANCH=gh-pages

STATUS=$(git status --porcelain)
if test "$STATUS"; then
    echo 'Repository is not clean. Clean it.'
    exit 1
fi

git checkout $SOURCE_BRANCH

# prepare the gh-pages branch
if test "$(git branch --list gh-pages)"; then
    git branch -D $DEST_BRANCH
fi
git checkout -B $DEST_BRANCH $SOURCE_BRANCH --no-track

npm run build
rm -rf bin/ flow-typed/ playground/ screenshots/ scripts/ src/ test/
find ./ -type f -depth 1 -not -name '.git*' -not -name package.json -delete
mv build/* ./
rm -f build/.DS_Store
rmdir build/

# and … push
git add --all ./
git commit -m "build app" --quiet
git push -f "https://github.com/hawkrives/gobbldygook.git" $DEST_BRANCH
curl -d "apiKey=7e393deddaeb885f5b140b4320ecef6b" -d "repository=https://github.com/hawkrives/gobbldygook" -d "revision=$(git rev-parse --verify HEAD)" 'https://notify.bugsnag.com/deploy'

git checkout $SOURCE_BRANCH
