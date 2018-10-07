// @flow

import {Student} from '@gob/object-student'

export async function loadStudent(studentId: string) {
	const rawStudent = localStorage.getItem(studentId)

	if (rawStudent == null || rawStudent === '[object Object]') {
		localStorage.removeItem(studentId)
		return new Student()
	}

	try {
		let basicStudent = JSON.parse(rawStudent)
		return new Student(basicStudent)
	} catch (e) {
		console.error(e)
		return new Student()
	}
}
