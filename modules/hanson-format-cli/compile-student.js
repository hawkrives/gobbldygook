'use strict'

const nom = require('nomnom')
const fs = require('graceful-fs')
const yaml = require('js-yaml')
const enhanceHanson = require('modules/hanson-format').enhanceHanson

function compileStudent(args, data) {
	let obj = yaml.safeLoad(data)
	return enhanceHanson(obj)
}

module.exports = function cli() {
	let args = nom()
		.script('compile-student')
		.option('filename', {
			position: 0,
			required: true,
			help: 'the file to process',
		})

	let data = fs.readFileSync(args.filename, { encoding: 'utf-8' })
	let student = compileStudent(args, data)
	console.log(JSON.stringify(student, null, 2))
}
