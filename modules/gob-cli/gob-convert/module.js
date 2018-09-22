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
const {version} = require('../package.json')

global.VERSION = version

function args() {
	return meow(usage, {
		booleanDefault: false,
	})
}

export default async function main() {
	let {input} = args()

	let data = input.length
		? await loadJsonFile(input[0])
		: JSON.parse(await stdin())

	let hydrated = await convertStudent(data, getCourse)

	for (let schedule of Object.values(hydrated.schedules)) {
		delete (schedule: any).courses
	}

	console.log(JSON.stringify(hydrated))
}
