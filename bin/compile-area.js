'use strict'
const bluebird = require('bluebird')
let fs = require('graceful-fs')
fs = bluebird.promisifyAll(fs)

const nom = require('nomnom')
const yaml = require('js-yaml')
const stringify = require('json-stable-stringify')
const enhanceHanson = require('../src/area-tools/enhance-hanson')
const getStdin = require('get-stdin')
const includes = require('lodash/includes')

const loggers = {
	text: console.dir.bind(console),
	json: data => console.log(stringify(data, {space: 2})),
	yaml: data => console.log(yaml.safeDump(data)),
}

function compileArea(args, data) {
	let obj = yaml.safeLoad(data)

	if (args.parse) {
		obj = enhanceHanson(obj)
	}

	return obj
}

function loadFile(path) {
	return fs.readFileAsync(path, 'utf-8')
}

module.exports.cli = async function cli() {
	let args = nom()
		.script('compile-area')
		.option('input', {
			help: 'The file or folder to process',
			list: true,
			position: 0,
			default: [],
		})
		.option('enhance', {
			help: 'Run the enhancer',
			flag: true,
			default: true,
		})
		.option('stdin', {
			help: 'Read a file from stdin',
			flag: true,
		})
		.option('out-format', {
			help: 'The output style',
			abbr: 'f',
			choices: Object.keys(loggers),
			default: 'text',
		})
		.option('out-dir', {
			help: 'The output folder',
			abbr: 'd',
		})
		.option('debug', {
			help: 'Enable debugging output',
			flag: true,
		})
		.parse()

	if (args.debug) {
		console.error(args)
	}

	let logger = loggers[args['out-format']]

	let fromStdin = includes(args, '-')
	let sources = args.input.filter(fn => fn !== '-').map(loadFile)
	if (fromStdin && process.stdin.isTTY) {
		sources.push(getStdin())
	}

	let files = await Promise.all(sources)
	let results = files.map(area => compileArea(args, area))

	results.forEach(logger)
}
