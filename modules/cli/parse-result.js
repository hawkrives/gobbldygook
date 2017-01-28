const parse = require('modules/core/examine-student/parse-hanson-string').parse
const nom = require('nomnom')
const stringify = require('stabilize')
const yaml = require('js-yaml')
const util = require('util')
const getStdin = require('get-stdin')

function parseString(args, string) {
	if (string.length === 0) {
		throw new Error('Either --stdin or an argument is required')
	}

	const parsed = parse(string)

	if (args.json) {
		console.log(stringify(parsed, {space: 4}))
	}
	else if (args.yaml) {
		console.log(yaml.safeDump(parsed))
	}
	else {
		console.log(util.inspect(parsed, {depth: null}))
	}
}

module.exports.cli = function cli() {
	const args = nom
		.option('json', {flag: true, help: 'Print the result as valid JSON'})
		.option('yaml', {flag: true, help: 'Print the result as YAML'})
		.option('stdin', {flag: true, help: 'Take input via STDIN'})
		.option('string', {position: 0})
		.parse()

	if (args.stdin) {
		getStdin()
			.then(string => parseString(args, string))
			.catch(err => {
				throw err
			})
	}
	else {
		parseString(args, args.string)
	}
}

process.on('unhandledRejection', reason => {
	console.error(reason)
})
