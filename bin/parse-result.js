import {parse} from '../src/area-tools/parse-hanson-string'
import nom from 'nomnom'
import stringify from 'json-stable-stringify'
import yaml from 'js-yaml'
import util from 'util'

export function cli() {
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
