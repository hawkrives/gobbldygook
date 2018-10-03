// @flow

import {Student} from '@gob/object-student'
import debug from 'debug'
const log = debug('web:check-student')

export async function loadStudent(studentId: string) {
	const rawStudent = localStorage.getItem(studentId)

	if (rawStudent == null || rawStudent === '[object Object]') {
		localStorage.removeItem(studentId)
		return null
	}

	// basicStudent defaults to an empty object so that the constructor has
	// something to build from.
	let basicStudent = {}

	try {
		basicStudent = JSON.parse(rawStudent)
	} catch (e) {
		log(e)
	}

	return new Student(basicStudent)
}
