#!/bin/bash -ve

DEST_BRANCH=gh-pages

# prepare the gh-pages branch
git checkout -B $DEST_BRANCH --no-track

rm -rf bin/ config/ flow-typed/ modules/ playground/ screenshots/ scripts/
find ./ -maxdepth 1 -type f -not -name '.git*' -not -name package.json -delete
mv build/* ./
rm -f build/.DS_Store
rmdir build/

# Get the deploy key by using Travis's stored variables to decrypt config/deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K "$ENCRYPTED_KEY" -iv "$ENCRYPTED_IV" -in config/deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
eval "${ssh-agent -s}"
ssh-add deploy_key

# and … push
git add --all ./
git commit -m "build app" --quiet
git push -f "https://github.com/hawkrives/gobbldygook.git" $DEST_BRANCH
curl -d "apiKey=7e393deddaeb885f5b140b4320ecef6b" -d "repository=https://github.com/hawkrives/gobbldygook" -d "revision=$(git rev-parse --verify HEAD)" 'https://notify.bugsnag.com/deploy'
