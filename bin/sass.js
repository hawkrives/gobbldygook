#!/usr/bin/env node

var start = process.hrtime()

var discardFontFace = require('postcss-discard-font-face')
var fontFamily      = require('postcss-font-family')
var autoprefixer    = require('autoprefixer-core')
var colorMin        = require('postcss-colormin')
var prettyHrtime    = require('pretty-hrtime')
var calc            = require('postcss-calc')
var sass            = require('node-sass')
var postcss         = require('postcss')
var fs              = require('fs')

if (process.argv.length < 4) {
	console.log('Arguments: sass.js fromFile toFile')
	process.exit()
}

var fromFile = process.argv[2]
var toFile = process.argv[3]

var cssData = sass.renderSync({
	file: fromFile,
	outFile: toFile,
	sourceMap: true,
	sourceMapEmbed: true,
})

var processors = [
	autoprefixer(),
	calc(),
	fontFamily(),
	discardFontFace(),
	colorMin(),
]

postcss(processors)
	.process(cssData.css, {
		from: fromFile,
		to: toFile,
	})
	.then(function(result) {
		fs.writeFileSync(toFile, result.css)
		if (result.map)
			fs.writeFileSync(toFile + '.map', JSON.stringify(result.map))
	})
	.then(function() {
		var end = process.hrtime(start)
		console.log('Sassed', fromFile, 'into', toFile, 'in', prettyHrtime(end))
	})

