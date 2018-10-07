// @flow

import stringify from 'stabilize'
import {Student} from '@gob/object-student'

export function getIdCache(): Set<string> {
	return new Set(JSON.parse(localStorage.getItem('studentIds') || '[]'))
}

export function setIdCache(ids: Set<string>) {
	localStorage.setItem('studentIds', JSON.stringify([...ids]))
}

export function addStudentToCache(studentId: string) {
	let ids = getIdCache()
	ids.add(studentId)
	setIdCache(ids)
}

export function removeStudentFromCache(studentId: string) {
	let ids = getIdCache()
	ids.delete(studentId)
	setIdCache(ids)
}

export async function saveStudent(student: Student) {
	console.info(`saving ${student.id} (${student.name})`)

	student = student.set('dateLastModified', new Date())
	let str = stringify(student)
	localStorage.setItem(student.id, str)
	addStudentToCache(student.id)

	return student
}
