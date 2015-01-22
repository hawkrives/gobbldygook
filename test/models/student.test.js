// test/models/student.test.js
jest.dontMock('../../app/models/student.js')
jest.dontMock('immutable')
jest.dontMock('lodash')
jest.dontMock('../../app/models/demoStudent.json')
import Student from '../../app/models/student.js'
import {List, Map} from 'immutable'
import demoStudent from '../../app/models/demoStudent.json'
import {zipObject, pluck} from 'lodash'

describe('Student', () => {
	let stu = undefined
	beforeEach(() => {
		stu = new Student(demoStudent)
	})

	it('is a Student', () => {
		expect(stu instanceof Student).toBe(true)
	})

	it('can be turned into a JS object', () => {
		expect(stu.toJS() instanceof Object).toBe(true)
	})

	it('ignores sets on known properties', () => {
		try {
			stu.name = 3
		} catch (err) {}
		expect(stu.name).toBe('Hawken MacKay Rives')
	})

	it('creates a unique ID for each new student without an ID prop', () => {
		let stu1 = new Student()
		let stu2 = new Student()
		expect(stu1.id).not.toEqual(stu2.id)
	})

	it('holds a student', () => {
		let {
			id,
			matriculation,
			graduation,
			studies,
			schedules,
			overrides,
			fabrications,
			settings,
			creditsNeeded,
		} = stu

		// console.log(schedules.toList().toJSON())
		// console.log(demoStudent.schedules)

		expect(stu).toBeDefined()
		expect(id).toBeDefined()
		expect(matriculation).toBe(2012)
		expect(graduation).toBe(2016)
		expect(studies.toList().toJSON()).toEqual(demoStudent.studies)
		expect(schedules.toList().toJSON()).toEqual(demoStudent.schedules)
		expect(fabrications.toJSON()).toEqual(demoStudent.fabrications)
		expect(settings).toEqual(demoStudent.settings)
		expect(creditsNeeded).toEqual(35)

		let keys = pluck(demoStudent.overrides, 'what')
		let demoOverrides = zipObject(keys, demoStudent.overrides)
		expect(overrides.toJSON()).toEqual(demoOverrides)
	})


	it('can turn into JSON', () => {
		let result = JSON.stringify(stu)
		expect(result).toBeTruthy()
	})
})
