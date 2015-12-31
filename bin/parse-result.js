const parse = require('../src/area-tools/parse-hanson-string').parse
const nom = require('nomnom')
const stringify = require('json-stable-stringify')
const yaml = require('js-yaml')
const util = require('util')

exports.cli = function cli() {
	const args = nom
		.option('json', {flag: true, help: 'Print the result as valid JSON'})
		.option('yaml', {flag: true, help: 'Print the result as YAML'})
		.option('string', {position: 0, required: true})
		.parse()

	const string = parse(args.string)

	if (args.json) {
		console.log(stringify(string, {space: 4}))
	}
	else if (args.yaml) {
		console.log(yaml.safeDump(string))
	}
	else {
		console.log(util.inspect(string, {depth: null}))
	}
}
