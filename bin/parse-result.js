import {parse} from '../src/lib/parse-hanson-string'
import nom from 'nomnom'
import stringify from 'json-stable-stringify'

export function cli() {
	const args = nom
		.option('json', {flag: true})
		.option('string', {position: 0, required: true})
		.parse()

	const string = stringify(parse(args.string), {space: 4})
	if (args.flags.js) {
		console.log(string
			.replace(/"/g, `'`)
			.replace(/'(.*?)'(:.*)/g, '$1$2'))
	}
	else {
		console.log(string)
	}
}
