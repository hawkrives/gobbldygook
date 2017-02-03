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
	ids = union(ids, [studentId])
	setIdCache(ids)
}

export function removeStudentFromCache(studentId) {
	let ids = getIdCache()
	ids = reject(ids, id => id === studentId)
	setIdCache(ids)
}

export function saveStudent(student) {
	// 1. grab the old (still JSON-encoded) student from localstorage
	// 2. compare it to the current one
	// 3. if they're different, update dateLastModified, stringify, and save.

	const oldVersion = localStorage.getItem(student.id)

	let prepared = prepareStudentForSave(student)

	return Promise.resolve()
		.then(() => {
			if (oldVersion === stringify(prepared)) {
				return
			}
			log(`saving student ${prepared.name} (${prepared.id})`)
			prepared = { ...prepared, dateLastModified: new Date() }
			localStorage.setItem(prepared.id, stringify(prepared))
			return addStudentToCache(prepared.id)
		})
		.then(() => {
			return prepared
		})
}
