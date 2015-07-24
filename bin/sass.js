#!/usr/bin/env node
const start = process.hrtime()

import discardFontFace from 'postcss-discard-font-face'
import fontFamily from 'postcss-font-family'
import autoprefixer from 'autoprefixer-core'
import colorMin from 'postcss-colormin'
import prettyHrtime from 'pretty-hrtime'
import calc from 'postcss-calc'
import sass from 'node-sass'
import postcss from 'postcss'
import fs from 'graceful-fs'

if (process.argv.length < 4) {
	console.log('Arguments: sass.js fromFile toFile')
	process.exit()
}

const fromFile = process.argv[2]
const toFile = process.argv[3]

const cssData = sass.renderSync({
	file: fromFile,
	outFile: toFile,
	sourceMap: true,
	sourceMapEmbed: true,
})

const processors = [
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
		if (result.map) {
			fs.writeFileSync(toFile + '.map', JSON.stringify(result.map))
		}
	})
	.then(function() {
		const end = process.hrtime(start)
		console.log('Sassed', fromFile, 'into', toFile, 'in', prettyHrtime(end))
	})

