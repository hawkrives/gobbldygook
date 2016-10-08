import {union} from 'lodash'
import {reject} from 'lodash'
import stringify from 'stabilize'
import {mapValues} from 'lodash'
import {omit} from 'lodash'

export function getIdCache() {
	return JSON.parse(localStorage.getItem('studentIds') || '[]')
}


export function setIdCache(ids) {
	localStorage.setItem('studentIds', JSON.stringify(ids))
}


export function addStudentToCache(studentId) {
	let ids = getIdCache()
	ids = union(ids, [studentId])
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

	student = {...student}
	student = omit(student, ['areas', 'canGraduate', 'fulfilled'])
	student.schedules = mapValues(student.schedules, s => omit(s, ['courses', 'conflicts', 'hasConflict']))

	if (oldVersion !== stringify(student)) {
		console.log(`saving student ${student.name} (${student.id})`)
		student = {...student, dateLastModified: new Date()}
		localStorage.setItem(student.id, stringify(student))
		await addStudentToCache(student.id)
	}

	return student
}
