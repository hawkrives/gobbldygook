#!/usr/bin/env node
/* eslint-env node */
const fs = require('fs')
const path = require('path')

let extensionsToRemove = ['.woff', '.woff2', '.map', '.worker.js']
let base = __dirname + '/../modules/gob-web/build'

let files = () => fs.readdirSync(base)

for (let file of files()) {
	for (let toRemove of extensionsToRemove) {
		if (file.endsWith(toRemove)) {
			console.log(`rm ${path.join(base, file)}`)
			fs.unlinkSync(path.join(base, file))
		}
	}
}

for (let file of files()) {
	if (!(file.endsWith('.js') || file.endsWith('.css'))) {
		continue
	}

	let chunks = file.split('.')

	// it's got at least three dots: name.abad1dea.js
	let newName =
		chunks.slice(0, -2).join('.') + '.' + chunks[chunks.length - 1]

	console.log(`mv ${path.join(base, file)} ${path.join(base, newName)}`)
	fs.renameSync(path.join(base, file), path.join(base, newName))
}
