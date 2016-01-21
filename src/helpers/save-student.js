import union from 'lodash/union'
import reject from 'lodash/reject'
import stringify from 'json-stable-stringify'
import omit from 'lodash/omit'

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


export default async function saveStudent(student) {
	// 1. grab the old (still JSON-encoded) student from localstorage
	// 2. compare it to the current one
	// 3. if they're different, update dateLastModified, stringify, and save.

	const oldVersion = localStorage.getItem(student.id)

	if (oldVersion !== stringify(student)) {
		!TESTING && console.log(`saving student ${student.name} (${student.id})`)
		student = {...student, dateLastModified: new Date()}
		student = omit(student, ['areas', 'canGraduate'])
		student.schedules = omit({...student.schedules}, ['courses', 'conflicts', 'hasConflict'])
		localStorage.setItem(student.id, stringify(student))
		await addStudentToCache(student.id)
	}

	return student
}
