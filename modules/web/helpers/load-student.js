import { Student } from '../../object-student'
import debug from 'debug'
const log = debug('web:check-student')

export function loadStudent(studentId) {
	return new Promise(resolve => {
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
