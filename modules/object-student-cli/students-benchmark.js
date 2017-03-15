import fs from 'graceful-fs'
import { evaluate } from '../examine-student'
import endsWith from 'lodash/endsWith'
import junk from 'junk'
import nom from 'nomnom'
import ms from 'pretty-ms'
import range from 'lodash/range'
import sparkly from 'sparkly'
import mean from 'lodash/mean'
import loadArea from '../cli/lib/load-area'

function now(other=[]) {
	let time = process.hrtime(other)
	return time[0] * 1e3 + time[1] / 1e6
}

function loadStudents(dir) {
	return fs.readdirSync(dir)
		.filter(name => !endsWith(name, '.ip'))
		.filter(junk.not)
		.map(path => dir + path)
		.map(path => fs.readFileSync(path, 'utf-8'))
		.map(JSON.parse)
}

async function benchmark({ runs, graph }) {
	for (const { courses=[], overrides={}, areas=[] } of loadStudents('./test/example-students/')) {
		for (const areaInfo of areas) {
			console.log(`the '${areaInfo.name}' ${areaInfo.type} (${areaInfo.revision})`)
			const areaData = await loadArea(areaInfo)  // eslint-disable-line no-await-in-loop

			let times = range(runs).map(() => {
				const start = process.hrtime()
				evaluate({ courses, overrides }, areaData)
				return now(start)
			})

			const avg = mean(times)
			if (graph) {
				console.log(`  ${sparkly(times, { min: 0 })}`)
			}
			console.log(`  average time: ${ms(avg)} (over ${runs} runs)\n`)
		}
	}
}

export function cli() {
	const args = nom
		.script('students-benchmark')
		.option('runs', {
			string: '-r, --runs',
			metavar: 'COUNT',
			default: 50,
		})
		.option('graph', {
			flag: true,
			default: true,
		})
		.option('debug', { flag: true })
		.parse()

	if (args.debug) {
		console.log(args)
	}

	const runs = args.runs
	const graph = args.graph
	benchmark({ runs, graph })
}

if (require.main === module) {
	cli()
}
