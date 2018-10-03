// @flow

const usage = `
usage: gob-validate < file
validates the schedules of the given student
`

import meow from 'meow'
import stdin from 'get-stdin'
import loadJsonFile from 'load-json-file'
import {getOnlyCourse} from '../lib/get-course'
import {validateSchedule, Student, Schedule} from '@gob/object-student'
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

	let data = input.length
		? await loadJsonFile(input[0])
		: JSON.parse(await stdin())

	let student = new Student(data)

	let promises = student.schedules.map(async schedule => {
		let [courses, conflictInfo] = await Promise.all([
			schedule.getOnlyCourses(getOnlyCourse),
			validateSchedule(schedule, getOnlyCourse),
		])

		let {hasConflict, conflicts} = conflictInfo

		return {
			...schedule.toJSON(),
			courses,
			term: schedule.getTerm(),
			hasConflict,
			conflicts,
		}
	})

	let schedules = await Promise.all(promises.values())

	let anyConflicts = schedules.some(s => s.hasConflict)

	for (let schedule of schedules) {
		let {courses, hasConflict, conflicts} = schedule

		if (!hasConflict) {
			continue
		}

		print(0, `${toPrettyTerm(schedule.term)}`)

		for (let course of courses) {
			print(1, buildDeptNum(course))

			let courseConflicts = conflicts.get(course.clbid)

			if (!courseConflicts) {
				continue
			}

			let courseHasConflict = courseConflicts.some(Boolean)

			if (!courseHasConflict) {
				print(2, 'No warnings')
				continue
			}

			for (let conflict of courseConflicts) {
				if (!conflict) {
					continue
				}

				print(2, `- ${conflict.msg}`)
			}
		}
	}

	if (!anyConflicts) {
		console.log('No warnings')
	}
}
