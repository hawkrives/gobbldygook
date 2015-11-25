import evaluate from '../src/area-tools/evaluate'
import nomnom from 'nomnom'
import fs from 'graceful-fs'
import compute from '../src/area-tools/compute'
import get from 'lodash/object/get'
import loadArea from './lib/load-area'
import yaml from 'js-yaml'

const checkAgainstArea = ({courses, overrides}, args) => areaData => {
	if (args.path) {
		const result = compute(
			get(areaData, args.path), {
				path: [areaData.type, areaData.name].concat(args.path.split('.')),
				courses, overrides})
		console.log(result)
		return
	}

	const result = evaluate({courses, overrides}, areaData)

	if (args.json) {
		console.log(JSON.stringify(result, null, 2))
	}
	else if (args.yaml) {
		console.log(yaml.safeDump(result))
	}
	else if (args.prose) {
		console.log('not implemented')
		// console.log(proseify(result))
	}
	else if (args.summary) {
		console.log('not implemented')
		// console.log(summarize(result))
	}

	if (!result.computed) {
		process.exit(1)
	}
}

function run({courses, overrides, areas}, args) {
	Promise.all(areas.map(loadArea)).then(areaDatœ => {
		for (const area of areaDatœ) {
			checkAgainstArea({courses, overrides}, args)(area)
		}
	})
}

export function cli() {
	const args = nomnom()
		.option('json', {
			flag: true,
			help: 'print raw json output',
		})
		.option('yaml', {
			flag: true,
			help: 'print yaml-formatted json output',
		})
		.option('prose', {
			flag: true,
			help: 'print prose output',
		})
		.option('summary', {
			flag: true,
			help: 'print summarized output',
		})
		.option('status', {
			flag: true,
			help: 'no output; only use exit code',
		})
		.option('path', {
			type: 'text',
			help: 'change the root of the evaluation',
		})
		.option('studentFile', {
			required: true,
			metavar: 'FILE',
			help: 'The file to process',
			position: 0,
		})
		.parse()

	run(JSON.parse(fs.readFileSync(args.studentFile, 'utf-8')), args)
}
