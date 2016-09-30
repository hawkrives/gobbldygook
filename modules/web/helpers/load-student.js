import Bluebird from 'bluebird'

import {Student} from 'modules/core'
const log = (...args) => TESTING || /* istanbul ignore next */ console.error(...args)

export function loadStudent(studentId) {
	return new Bluebird(resolve => {
		const rawStudent = localStorage.getItem(studentId)

		if (rawStudent === null || rawStudent === '[object Object]') {
			localStorage.removeItem(studentId)
			resolve(null)
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

		resolve(Student(basicStudent))
	})

}
