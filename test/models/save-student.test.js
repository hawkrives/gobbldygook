import {expect} from 'chai'
import cloneDeep from 'lodash/lang/cloneDeep'
import reject from 'lodash/collection/reject'
import omit from 'lodash/object/omit'
import {v4 as uuid} from 'uuid'

import {
	default as saveStudent,
	addStudentToCache,
	removeStudentFromCache,
	getIdCache,
	setIdCache,
} from '../../src/models/save-student'
import demoStudent from '../../src/models/demo-student.json'

const student = cloneDeep(demoStudent)
student.id = uuid()
Object.freeze(student)

describe('saveStudent', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	it('returns a promise', () => {
		expect(saveStudent({id: student.id})).to.be.instanceof(Promise)
	})

	it('saves a student', () => {
		saveStudent(student)
		let expectedStudentIds = [student.id]
		let actualStudentIds = JSON.parse(localStorage.getItem('studentIds'))
		expect(actualStudentIds).to.deep.equal(expectedStudentIds)
		let expectedStudent = student
		let actualStudent = JSON.parse(localStorage.getItem(student.id))
		expect(omit(actualStudent, ['dateLastModified'])).to.deep.equal(expectedStudent)
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
		let actual = JSON.parse(localStorage.getItem('studentIds'))
		expect(actual).to.deep.equal(expected)
	})

	it('does not add an id if one already exists', () => {
		addStudentToCache('3')
		let expected = ids
		let actual = JSON.parse(localStorage.getItem('studentIds'))
		expect(actual).to.deep.equal(expected)
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
		let expected = reject(ids, id => id === '1')
		let actual = JSON.parse(localStorage.getItem('studentIds'))
		expect(actual).to.deep.equal(expected)
	})

	it('does not throw if the id does not exist', () => {
		removeStudentFromCache('300')
		let expected = ids
		let actual = JSON.parse(localStorage.getItem('studentIds'))
		expect(actual).to.deep.equal(expected)
	})
})


describe('getIdCache', () => {
	it('gets the list of student ids', () => {
		localStorage.clear()
		const ids = ['1', '2', '3']
		localStorage.setItem('studentIds', JSON.stringify(ids))
		expect(getIdCache()).to.deep.equal(ids)
	})

	it('returns an empty array when there are no ids in the cache', () => {
		localStorage.clear()
		expect(getIdCache()).to.deep.equal([])
	})
})

describe('setIdCache', () => {
	it('sets the list of student ids', () => {
		localStorage.clear()
		const ids = ['1', '2', '3']
		setIdCache(ids)
		let actual = JSON.parse(localStorage.getItem('studentIds'))
		let expected = ids
		expect(actual).to.deep.equal(expected)
	})
})
