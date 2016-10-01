#!/bin/bash -ve

DEST_BRANCH=gh-pages

# prepare the gh-pages branch
git checkout -B $DEST_BRANCH --no-track

# Get the deploy key by using Travis's stored variables to decrypt config/deploy_key.enc
openssl aes-256-cbc -K "$encrypted_25d766a04336_key" -iv "$encrypted_25d766a04336_iv" -in config/deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key

# Remove unneeded files
rm -rf bin/ config/ flow-typed/ modules/ playground/ screenshots/ scripts/
find ./ -maxdepth 1 -type f -not -name '.git*' -not -name package.json -not -name deploy_key -delete
mv build/* ./
rm -f build/.DS_Store
rmdir build/

# and … push
git add --all ./
git commit -m "build app" --quiet
git push -f "https://github.com/hawkrives/gobbldygook.git" $DEST_BRANCH
curl -d "apiKey=7e393deddaeb885f5b140b4320ecef6b" -d "repository=https://github.com/hawkrives/gobbldygook" -d "revision=$(git rev-parse --verify HEAD)" 'https://notify.bugsnag.com/deploy'
