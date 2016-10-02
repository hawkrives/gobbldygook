#!/bin/bash -ve

DEST_BRANCH=gh-pages

# prepare the gh-pages branch
git checkout -B $DEST_BRANCH --no-track

# Get the deploy key by using Travis's stored variables to decrypt config/deploy_key.enc
openssl aes-256-cbc -K "$encrypted_cdc0ae2f855f_key" -iv "$encrypted_cdc0ae2f855f_iv" -in config/deploy_key.enc -out ~/.ssh/deploy_key -d
eval "$(ssh-agent -s)"
chmod 600 ~/.ssh/deploy_key
echo "Host github.com" >> ~/.ssh/config
echo "  IdentityFile ~/.ssh/deploy_key" >> ~/.ssh/config
# ssh-add config/deploy_key

# Remove unneeded files
rm -rf bin/ config/ flow-typed/ modules/ playground/ screenshots/ scripts/
find ./ -maxdepth 1 -type f -not -name '.git*' -not -name package.json -not -name deploy_key -delete
mv build/* ./
rm -f build/.DS_Store
rmdir build/

oghliner offline ./ --file-globs '*.js,*.css,*.woff,*.html,*.url'

# and … push
git add --all ./
git commit -m "build app" --quiet
git push -f "https://github.com/hawkrives/gobbldygook.git" $DEST_BRANCH
curl -d "apiKey=7e393deddaeb885f5b140b4320ecef6b" -d "repository=https://github.com/hawkrives/gobbldygook" -d "revision=$(git rev-parse --verify HEAD)" 'https://notify.bugsnag.com/deploy'
