// @flow

import uuid from 'uuid/v4'
import {Student} from '@gob/object-student'
import {
	saveStudent,
	addStudentToCache,
	removeStudentFromCache,
	getIdCache,
	setIdCache,
} from '../save-student'
const demoStudent = require('@gob/object-student/demo-student.json')

const student = new Student({...demoStudent, id: uuid()})

describe('saveStudent', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	it('returns a promise', () => {
		expect(saveStudent(student).then).toBeDefined()
	})

	it('saves a student', async () => {
		await saveStudent(student)
		let expectedStudentIds = [student.id]
		let actualStudentIds = JSON.parse(
			localStorage.getItem('studentIds') || '[]',
		)
		expect(actualStudentIds).toEqual(expectedStudentIds)
		let actualStudent = JSON.parse(localStorage.getItem(student.id) || '{}')

		let {dateLastModified: _1, ...expected} = student.toJS()
		let {dateLastModified: _2, ...actual} = actualStudent
		expect(actual).toEqual(expected)
	})
})

describe('addStudentToCache', () => {
	let ids
	beforeEach(() => {
		ids = ['1', '2', '3']
		localStorage.clear()
		localStorage.setItem('studentIds', JSON.stringify(ids))
	})

	it('adds an id to the list of student ids', () => {
		addStudentToCache('5')
		let expected = ids.concat(['5'])
		let actual = JSON.parse(localStorage.getItem('studentIds') || '[]')
		expect(actual).toEqual(expected)
	})

	it('does not add an id if one already exists', () => {
		addStudentToCache('3')
		let expected = ids
		let actual = JSON.parse(localStorage.getItem('studentIds') || '[]')
		expect(actual).toEqual(expected)
	})
})

describe('removeStudentFromCache', () => {
	let ids
	beforeEach(() => {
		ids = ['1', '2', '3']
		localStorage.clear()
		localStorage.setItem('studentIds', JSON.stringify(ids))
	})

	it('removes an id from the list of student ids', () => {
		removeStudentFromCache('1')
		let expected = ids.filter(id => id !== '1')
		let actual = JSON.parse(localStorage.getItem('studentIds') || '[]')
		expect(actual).toEqual(expected)
	})

	it('does not throw if the id does not exist', () => {
		removeStudentFromCache('300')
		let expected = ids
		let actual = JSON.parse(localStorage.getItem('studentIds') || '[]')
		expect(actual).toEqual(expected)
	})
})

describe('getIdCache', () => {
	it('gets the list of student ids', () => {
		localStorage.clear()
		const ids = new Set(['1', '2', '3'])
		localStorage.setItem('studentIds', JSON.stringify([...ids]))
		expect(getIdCache()).toEqual(ids)
	})

	it('returns an empty array when there are no ids in the cache', () => {
		localStorage.clear()
		expect(getIdCache()).toEqual(new Set())
	})
})

describe('setIdCache', () => {
	it('sets the list of student ids', () => {
		localStorage.clear()
		const ids = new Set(['1', '2', '3'])
		setIdCache(ids)
		let actual = new Set(
			JSON.parse(localStorage.getItem('studentIds') || '[]'),
		)
		let expected = ids
		expect(actual).toEqual(expected)
	})
})
