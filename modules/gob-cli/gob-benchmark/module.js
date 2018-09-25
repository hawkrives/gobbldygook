import meow from 'meow'
import loadJsonFile from 'load-json-file'
import {evaluate} from '@gob/examine-student'
import ms from 'pretty-ms'
import writeJsonFile from 'write-json-file'
import sparkly from 'sparkly'
import mean from 'lodash/mean'
import loadArea from '../lib/load-area'
import {getAllCourses} from '../lib/get-all-courses'
import pMap from 'p-map'
import groupBy from 'lodash/groupBy'
import present from 'present'
import sumBy from 'lodash/sumBy'
import sortBy from 'lodash/sortBy'
import flatMap from 'lodash/flatMap'

import Benchmark from 'benchmark'

async function load(filePath, {cache = true}) {
	let cachedName = filePath.replace('.gbstudent', '.cache')

	try {
		return await loadJsonFile(cachedName)
	} catch (error) {
		console.log('caching', filePath)

		let {
			schedules = {},
			overrides = {},
			studies = [],
			fabrications = {},
			name,
			id,
		} = await loadJsonFile(filePath)

		try {
			let [areas, courses] = await Promise.all([
				Promise.all(studies.map(loadArea)),
				getAllCourses({schedules, fabrications}),
			])

			if (!areas) {
				areas = []
			}

			// prevent null areas
			areas = areas.filter(x => Boolean(x))

			let student = {areas, courses, overrides, name, id}

			await writeJsonFile(cachedName, student, {indent: null})
			return student
		} catch (error) {
			console.error(filePath, error.message)
			return null
		}
	}
}

function benchmarkArea({stnum, area, courses, overrides}) {
	let bench = new Benchmark({
		name: String(stnum),
		fn: () => evaluate({courses, overrides}, area),
	})

	bench.run()

	return bench.stats
}

async function benchmark({files}) {
	console.log('loading...')
	let loadStart = present()
	let loadedFiles = await pMap(files, load, {concurrency: 4})
	let validFiles = loadedFiles.filter(f => Boolean(f))
	console.log('loaded in', ms(present() - loadStart))

	let validCount = validFiles.length
	let areaCount = sumBy(validFiles, f => f.areas.length)
	console.log(`evaluating ${validCount} files and ${areaCount} areas`)

	console.log('timing')
	let start = present()
	let stuCount = validFiles.length
	let results = flatMap(validFiles, ({areas, courses, overrides}, i) => {
		let stnum = files[i].replace(/[.].*/, '')
		let count = areas.length
		return areas.map((area, j) => {
			let type = area.type.toLowerCase()
			console.log(
				`evaluating ${i + 1}/${stuCount} ${stnum} ${j + 1}/${count}: ` +
					`${type}|${area.name}`,
			)
			return {
				...benchmarkArea({stnum, area, courses, overrides}),
				type: area.type,
				name: area.name,
			}
		})
	})
	let totalDuration = ms(present() - start)

	let totalCycles = sumBy(results, result => result.sample.length)

	console.log(
		`ran ${totalCycles} evaluations over ${areaCount} student/area combinations in ${totalDuration}`,
	)

	let timesInMs = results.map(r => r.mean * 1000)
	let roughPerRun = mean(timesInMs)
	// console.log(roughPerRun, timesInMs)
	console.log(`evaluation took around ${ms(roughPerRun)} per area`)

	let sorted = sortBy(timesInMs)
	console.log(`graph: ${sparkly(sorted, {min: 0})}`)

	let min = Math.min(...sorted)
	let max = Math.max(...sorted)
	console.log(`min: ${ms(min)}, max: ${ms(max)}`)

	let grouped = groupBy(results, ({type}) => type.toLowerCase())

	for (let [type, resultsForType] of Object.entries(grouped)) {
		console.log('\n')
		console.log(`## for ${type}:`)

		let timesInMs = resultsForType.map(r => r.mean * 1000)
		let roughPerRun = mean(timesInMs)
		// console.log(roughPerRun, timesInMs)
		console.log(`evaluation took around ${ms(roughPerRun)} per area`)

		let sorted = sortBy(timesInMs)
		console.log(`graph: ${sparkly(sorted, {min: 0})}`)

		let min = Math.min(...sorted)
		let max = Math.max(...sorted)
		console.log(`min: ${ms(min)}, max: ${ms(max)}`)
	}
}

async function realWorldBenchmark({files}) {
	console.log('loading...')
	let loadStart = present()
	let loadedFiles = await pMap(files, f => load(f, {cache: false}), {
		concurrency: 4,
	})
	let validFiles = loadedFiles.filter(f => Boolean(f))
	console.log('loaded in', ms(present() - loadStart))

	let validCount = validFiles.length
	let areaCount = sumBy(validFiles, f => f.areas.length)
	console.log(`evaluating ${validCount} files and ${areaCount} areas`)

	let bench = new Benchmark({
		fn: () => {
			for (let {areas, courses, overrides} of validFiles) {
				for (let area of areas) {
					evaluate({courses, overrides}, area)
				}
			}
		},
	})

	bench.run()

	let count = bench.stats.sample.length
	console.log(
		`ran ${count} evaluations over ${areaCount} student/area combinations`,
	)

	console.log(
		`evaluation took around ${ms(bench.stats.mean * 1000)} per iteration`,
	)

	let sorted = sortBy(bench.stats.sample.map(t => t * 1000))
	console.log(`graph: ${sparkly(sorted, {min: 0})}`)

	let min = Math.min(...sorted)
	let max = Math.max(...sorted)
	console.log(`min: ${ms(min)}, max: ${ms(max)}`)
}

async function realWorldRun({files}) {
	console.log('loading...')
	let loadStart = present()
	let loadedFiles = await pMap(files, f => load(f, {cache: false}), {
		concurrency: 4,
	})
	let validFiles = loadedFiles.filter(f => Boolean(f))
	console.log('loaded in', ms(present() - loadStart))

	let validCount = validFiles.length
	let areaCount = sumBy(validFiles, f => f.areas.length)
	console.log(`evaluating ${validCount} files and ${areaCount} areas`)

	console.log('timing')
	let start = present()
	let stuCount = validFiles.length
	let results = flatMap(validFiles, ({areas, courses, overrides}, i) => {
		let stnum = files[i].replace(/[.].*/, '')
		let count = areas.length
		return areas.map((area, j) => {
			let type = area.type.toLowerCase()
			console.log(
				`evaluating ${i + 1}/${stuCount} ${stnum} ${j + 1}/${count}: ` +
					`${type}|${area.name}`,
			)
			let start = present()
			evaluate({courses, overrides}, area)
			let duration = present() - start
			return {
				duration,
				type,
				name: area.name,
			}
		})
	})
	let totalDuration = ms(present() - start)

	let totalCycles = results.length

	console.log(
		`ran ${totalCycles} evaluations over ${areaCount} student/area combinations in ${totalDuration}`,
	)

	let timesInMs = results.map(r => r.duration)
	let roughPerRun = mean(timesInMs)
	// console.log(roughPerRun, timesInMs)
	console.log(`evaluation took around ${ms(roughPerRun)} per area`)

	let sorted = sortBy(timesInMs)
	console.log(`graph: ${sparkly(sorted, {min: 0})}`)

	let min = Math.min(...sorted)
	let max = Math.max(...sorted)
	console.log(`min: ${ms(min)}, max: ${ms(max)}`)
}

export default async function main() {
	const args = meow(`
		usage: gob-benchmark <student-file> [student-file ...[student-file]]

		arguments:
			--real [default: false]
			--run [default: false]
			--debug
	`)

	if (args.flags.debug) {
		console.log(args)
	}

	let files = args.input
	let {real = false, run = false} = args.flags

	if (real) {
		await realWorldBenchmark({files})
	} else if (run) {
		await realWorldRun({files})
	} else {
		await benchmark({files})
	}
}
