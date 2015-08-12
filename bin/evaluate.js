import evaluate from '../src/lib/evaluate'
import meow from 'meow'
import pkg from '../package.json'
import fs from 'graceful-fs'
import compute from '../src/lib/compute'
import get from 'lodash/object/get'
import loadArea from './lib/load-area'

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
	areas.map(loadArea)
		.forEach(checkAgainstArea({courses, overrides}, args))
}

export function cli() {
	const args = meow({
		pkg,
		help: `Usage:
			evaluate [--json] [--prose] [--summary] [--status] [--path path.to.requirement] studentFile`,
	})

	let [filename] = args.input

	if (!args.flags.json && !args.flags.prose && !args.flags.summary && !args.flags.status) {
		args.showHelp()
		return
	}

	if (filename) {
		run(JSON.parse(fs.readFileSync(filename, 'utf-8')), args.flags)
	}
	else {
		args.showHelp()
	}
}
