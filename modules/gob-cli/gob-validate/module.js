// @flow

const usage = `
usage: gob-validate < file
validates the schedules of the given student
`

import meow from 'meow'
import stdin from 'get-stdin'
import loadJsonFile from 'load-json-file'
import {getCourse} from '../lib'
import {
	validateSchedule,
	type StudentType,
	type ScheduleType,
	type HydratedScheduleType,
} from '@gob/object-student'
import {toPrettyTerm, buildDeptNum} from '@gob/school-st-olaf-college'
const {version} = require('../package.json')

global.VERSION = version

function args() {
	return meow(usage, {booleanDefault: false})
}

const print = (indent, message) => {
	console.log(''.padStart(indent * 2, ' ') + message)
}

export default async function main() {
	let {input} = args()

	let data: StudentType = input.length
		? await loadJsonFile(input[0])
		: JSON.parse(await stdin())

	let promises = Object.values(data.schedules).map(async (schedule: any) => {
		;(schedule: ScheduleType)
		let term = parseInt(`${schedule.year}${schedule.semester}`)
		;(schedule: any).courses = await Promise.all(
			schedule.clbids.map(clbid =>
				getCourse({clbid, term}, data.fabrications),
			),
		)
	})

	await Promise.all(promises)

	let anyConflicts = false

	Object.values(data.schedules).forEach((schedule: any) => {
		;(schedule: HydratedScheduleType)
		let {hasConflict, conflicts, courses} = validateSchedule(schedule)
		let term = `${schedule.year}${schedule.semester}`

		if (hasConflict) {
			anyConflicts = true

			print(0, `${toPrettyTerm(term)}`)

			courses.forEach((course, i) => {
				print(1, buildDeptNum(course))

				let courseHasConflict = conflicts[i].some(c => c)

				if (!courseHasConflict) {
					print(2, 'No warnings')
					return
				}

				conflicts[i].forEach(conflict => {
					if (!conflict) {
						return
					}

					print(2, `- ${conflict.msg}`)
				})
			})
		}
	})

	if (!anyConflicts) {
		console.log('No warnings')
	}
}
