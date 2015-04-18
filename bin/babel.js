#!/usr/bin/env node

var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')

var entryPoint = process.args[2]

var b = browserify({
	cache: {},
	packageCache: {},
	entries: [entryPoint],
	debug: true,
})
var bundler = b

if (includes(process.args, '--watch'))
	bundler = watchify(b)

bundler.transform(babelify, {stage: 0})
