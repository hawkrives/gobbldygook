import buildQuery from '../src/helpers/build-query-from-string'
import nom from 'nomnom'
import stringify from 'json-stable-stringify'

export function cli() {
	const args = nom
		.option('json', {flag: true, help: 'Print the result as valid JSON'})
		.option('query', {position: 0, required: true})
		.parse()

	const query = buildQuery(args.query)

	if (args.json) {
		console.log(stringify(query, {space: 4}))
	}
	else {
		console.dir(query)
	}
}
