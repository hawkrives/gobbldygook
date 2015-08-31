import fs from 'graceful-fs'
import evaluate from '../src/lib/evaluate'
import includes from 'lodash/collection/includes'
import junk from 'junk'
import nom from 'nomnom'
import ms from 'pretty-ms'
import range from 'lodash/utility/range'
import size from 'lodash/collection/size'
import sparkly from 'sparkly'
import sum from 'lodash/collection/sum'
import loadArea from '../bin/lib/load-area'

function now(other=[]) {
	let time = process.hrtime(other)
	return time[0] * 1e3 + time[1] / 1e6
}

function loadStudents(dir) {
	return fs.readdirSync(dir)
		.filter(name => !includes(name, '.ip'))
		.filter(junk.not)
		.map(path => dir + path)
		.map(path => fs.readFileSync(path, 'utf-8'))
		.map(JSON.parse)
}

function benchmark({runs, graph}) {
	loadStudents('./test/example-students/')
		.forEach(({courses=[], overrides={}, areas=[]}) => {
			areas.forEach(areaInfo => {
				console.log(`the '${areaInfo.name}' ${areaInfo.type} (${areaInfo.revision})`)
				let areaData = loadArea(areaInfo)
				let times = range(runs).map(() => {
					const start = process.hrtime()
					evaluate({courses, overrides}, areaData)
					return now(start)
				})

				const avg = sum(times) / size(times)
				if (graph) {
					console.log(`  ${sparkly(times)}\n`)
				}
				console.log(`  average time: ${ms(avg)} (over ${runs} runs)\n`)
			})
		})
}

function cli() {
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
		.option('debug', {flag: true})
		.parse()

	if (args.debug) {
		console.log(args)
	}

	const runs = args.runs
	const graph = args.graph
	benchmark({runs, graph})
}

if (require.main === module) {
	cli()
}
