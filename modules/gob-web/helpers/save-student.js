// @flow

import stringify from 'stabilize'
import {Student, prepareStudentForSave} from '@gob/object-student'

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
	// 1. grab the old (still JSON-encoded) student from localstorage
	// 2. compare it to the current one
	// 3. if they're different, update dateLastModified, stringify, and save.

	const oldVersion = localStorage.getItem(student.id)

	let prepared = prepareStudentForSave(student)
	if (oldVersion === stringify(prepared)) {
		return
	}

	let toSave = student.set('dateLastModified', new Date())
	let toSavePrepared = prepareStudentForSave(toSave)

	localStorage.setItem(toSavePrepared.id, stringify(toSavePrepared))
	await addStudentToCache(toSavePrepared.id)

	return toSave
}
