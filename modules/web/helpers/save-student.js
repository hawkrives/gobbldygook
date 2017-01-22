import union from 'lodash/union'
import reject from 'lodash/reject'
import stringify from 'stabilize'
import { prepareStudentForSave } from 'modules/core'
import debug from 'debug'
const log = debug('web:save-student')

export function getIdCache() {
	return JSON.parse(localStorage.getItem('studentIds') || '[]')
}


export function setIdCache(ids) {
	localStorage.setItem('studentIds', JSON.stringify(ids))
}


export function addStudentToCache(studentId) {
	let ids = getIdCache()
	ids = union(ids, [ studentId ])
	setIdCache(ids)
}

export function removeStudentFromCache(studentId) {
	let ids = getIdCache()
	ids = reject(ids, id => id === studentId)
	setIdCache(ids)
}

export async function saveStudent(student) {
	// 1. grab the old (still JSON-encoded) student from localstorage
	// 2. compare it to the current one
	// 3. if they're different, update dateLastModified, stringify, and save.

	const oldVersion = localStorage.getItem(student.id)

	student = prepareStudentForSave(student)

	if (oldVersion !== stringify(student)) {
		log(`saving student ${student.name} (${student.id})`)
		student = { ...student, dateLastModified: new Date() }
		localStorage.setItem(student.id, stringify(student))
		await addStudentToCache(student.id)
	}

	return student
}
