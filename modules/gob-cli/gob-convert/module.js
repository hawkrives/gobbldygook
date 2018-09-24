// @flow

const usage = `
usage: gob-convert < file
outputs the converted file to stdout
`

import meow from 'meow'
import stdin from 'get-stdin'
import loadJsonFile from 'load-json-file'
import {getCourse} from '../lib'
import {convertStudent} from '@gob/school-st-olaf-college'
import writeJsonFile from 'write-json-file'
import pMap from 'p-map'
import present from 'present'
const {version} = require('../package.json')

global.VERSION = version

function args() {
	return meow(usage, {
		booleanDefault: false,
	})
}

async function convert(data) {
	let hydrated = await convertStudent(data, getCourse)

	for (let schedule of Object.values(hydrated.schedules)) {
		delete (schedule: any).courses
	}

	return hydrated
}

async function convertFile(filename) {
	let start = present()
	try {
		let data = await convert(await loadJsonFile(filename))
		await writeJsonFile(filename.replace('.json', '.gbstudent'), data, {indent: null})
		console.log(filename, 'in', present() - start, 'ms')
	} catch (error) {
		console.error(filename)
		console.error(error)
	}
}

export default async function main() {
	let {input} = args()

	let data = input.length
		? await loadJsonFile(input[0])
		: JSON.parse(await stdin())

	if (input.length > 1) {
		pMap(input, convertFile, {concurrency: 8})
	} else {
		console.log(JSON.stringify(await convert(data)))
	}
}
