import Student from '../models/student'

export default function loadStudent(studentId) {
	const rawStudent = localStorage.getItem(studentId)


	if (rawStudent === null || rawStudent === '[object Object]') {
		localStorage.removeItem(studentId)
		return null
	}

	// basicStudent defaults to an empty object so that the constructor has
	// something to build from.
	let basicStudent = {}

	try {
		basicStudent = JSON.parse(rawStudent)
	}
	catch (e) {
		console.error(e)
	}

	return Promise.resolve(Student(basicStudent))
}
