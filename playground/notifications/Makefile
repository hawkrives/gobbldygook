PATH := ../../node_modules/.bin:$(PATH)

start:
	env NODE_ENV=development webpack-dev-server --config .webpackrc.js

bundle.js: index.js store.js
	env NODE_ENV=development webpack --config .webpackrc.js

.PHONY: start
