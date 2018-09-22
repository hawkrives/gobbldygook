import meow from 'meow'
import loadJsonFile from 'load-json-file'
import {evaluate} from '@gob/examine-student'
import ms from 'pretty-ms'
import range from 'lodash/range'
import sparkly from 'sparkly'
import mean from 'lodash/mean'
import loadArea from '../lib/load-area'
import {getAllCourses} from '../lib/get-all-courses'

function now(other = []) {
	let time = process.hrtime(other)
	return time[0] * 1e3 + time[1] / 1e6
}

async function load(filePath) {
	let {
		schedules = {},
		overrides = {},
		studies = [],
		fabrications = {},
		name,
		id,
	} = await loadJsonFile(filePath)

	let areas = await Promise.all(studies.map(loadArea))
	let courses = await getAllCourses({schedules, fabrications})

	return {areas, courses, overrides, name, id}
}

function benchmarkArea({area, courses, overrides, runs, graph}) {
	let {name, type, revision} = area
	console.log(`the '${name}' ${type} (${revision})`)

	let times = range(runs).map(() => {
		const start = process.hrtime()
		evaluate({courses, overrides}, area)
		return now(start)
	})

	const avg = mean(times)
	if (graph) {
		console.log(`  ${sparkly(times, {min: 0})}`)
	}
	console.log(`  average time: ${ms(avg)} (over ${runs} runs)\n`)
}

async function benchmark({runs, graph, files}) {
	let loadedFiles = await Promise.all(files.map(load))

	for (const {areas, courses, overrides, name, id} of loadedFiles) {
		console.log(`## ${name} (${id}) ##`)
		for (const area of areas) {
			benchmarkArea({area, courses, overrides, runs, graph})
		}
	}
}

export default async function main() {
	const args = meow(`
		usage: gob-benchmark <student-file> [student-file ...[student-file]]

		arguments:
			--runs [default: 50]
			--graph [default: true]
			--debug
	`)

	if (args.flags.debug) {
		console.log(args)
	}

	let files = args.input
	let {runs = 50, graph = true} = args.flags

	await benchmark({runs, graph, files})
}
