'use strict'

const stdin = require('get-stdin')
const yaml = require('js-yaml')
const enhanceHanson = require('../hanson-format/index').enhanceHanson

function compileArea(data) {
	let obj = yaml.safeLoad(data)
	return enhanceHanson(obj)
}

module.exports.cli = function cli() {
	// let args = nom()
		// .script('compile-area')
		// .option('filename', {
		// 	position: 0,
		// 	help: 'the area to process',
		// })

	// let data = fs.readFileSync(args.filename, {encoding: 'utf-8'})
	stdin().then(data => {
		let student = compileArea(data)
		console.log(JSON.stringify(student, null, 2))
	}).catch(err => console.error(err))
}
