import Bluebird from 'bluebird'

import Student from '../models/student'
const log = (...args) => TESTING || /* istanbul ignore next */ console.error(...args)

export default function loadStudent(studentId) {
	const rawStudent = localStorage.getItem(studentId)

	if (rawStudent === null || rawStudent === '[object Object]') {
		localStorage.removeItem(studentId)
		return Bluebird.resolve(null)
	}

	// basicStudent defaults to an empty object so that the constructor has
	// something to build from.
	let basicStudent = {}

	try {
		basicStudent = JSON.parse(rawStudent)
	}
	catch (e) {
		log(e)
	}

	return Bluebird.resolve(Student(basicStudent))
}
