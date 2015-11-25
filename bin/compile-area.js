import nom from 'nomnom'
import fs from 'graceful-fs'
import yaml from 'js-yaml'
import enhanceHanson from '../src/area-tools/enhance-hanson'
import stringify from 'json-stable-stringify'

const loggers = {
	text: console.dir.bind(console),
	json: data => console.log(stringify(data, {space: 2})),
	yaml: data => console.log(yaml.safeDump(data)),
}

export function cli() {
	const args = nom()
		.script('compile-area')
		.option('file', {
			required: true,
			metavar: 'FILE',
			help: 'The file to process',
			position: 0,
		})
		.option('parse', {
			flag: true,
			default: true,
			help: 'Run the ehnancer',
		})
		.option('output', {
			choices: ['json', 'text', 'yaml'],
			default: 'text',
			help: 'The output style',
		})
		.option('debug', {
			flag: true,
			help: 'Enable debugging output',
		})
		.parse()

	if (args.debug) {
		console.log(args)
	}

	const data = fs.readFileSync(args.file, {encoding: 'utf-8'})
	const obj = yaml.safeLoad(data)

	const logger = loggers[args.output]

	if (args['parse']) {
		const enhanced = enhanceHanson(obj, {topLevel: true})
		logger(enhanced)
	}
	else {
		logger(obj)
	}
}
