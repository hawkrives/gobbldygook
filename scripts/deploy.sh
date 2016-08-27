#!/bin/bash -ve

STATUS=$(git status --porcelain)
if test "$STATUS"; then
    echo 'Repository is not clean. Clean it.'
    exit 1
fi

git checkout master

# prepare the gh-pages branch
if test "$(git branch --list gh-pages)"; then
    git branch -D gh-pages
fi
git checkout -B gh-pages master --no-track

npm run build
rm -rf bin/ flow-typed/ playground/ screenshots/ scripts/ src/ test/
find ./ -type f -depth 1 -not -name '.git*' -not -name package.json -delete
mv build/ ./

# and … push
git add --all ./
git commit -m "build app" --quiet
# git push -f "https://$GITHUB_OAUTH@github.com/stodevx/course-data.git" gh-pages
