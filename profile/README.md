To build `debug`:

1. install browserify and babelify
	`npm i browserify babelify`
2. build `profile.js`
	`./node_modules/.bin/browserify -t babelify ./profile/profile.babel.js > ./profile/profile.js`
3. open in Chrome (or other browser) and look at the 'profiles' section
	`./node_modules/.bin/opn ./profile/index.html`
