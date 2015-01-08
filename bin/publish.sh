cd ..

git pull --rebase

npm run build

grep package.json "sto-sis-time-parser@"

read -p "Version: "  version; \
npm version $version --message "v%s"
# npm publish

git push --follow-tags
