import evaluate from '../src/area-tools/evaluate'
import nomnom from 'nomnom'
import fs from 'graceful-fs'
import compute from '../src/area-tools/compute'
import get from 'lodash/object/get'
import loadArea from './lib/load-area'
import yaml from 'js-yaml'
import isRequirementName from '../src/area-tools/is-requirement-name'
import pairs from 'lodash/object/pairs'
import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import repeat from 'lodash/string/repeat'


function summarize(requirement, name, path, depth=0) {
	const subReqs = filter(pairs(requirement), ([k, _]) => isRequirementName(k))

	let prose = ''
	if (subReqs.length) {
		prose = '\n' + map(subReqs, ([k, v]) => {
			return summarize(v, k, path.concat(k), depth + 1)
		}).join('\n')
	}

	return `${repeat(' ', depth * 2)}${name}: ${requirement.computed}${prose}`
}

const checkAgainstArea = ({courses, overrides}, args) => areaData => {
	let result = {}
	if (args.path) {
		result = compute(
			get(areaData, args.path), {
				path: [areaData.type, areaData.name].concat(args.path.split('.')),
				courses, overrides})
	}

	else {
		result = evaluate({courses, overrides}, areaData)
	}

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
		console.log(summarize(result, areaData.name, [areaData.type, areaData.name]))
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
