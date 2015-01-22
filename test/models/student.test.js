// test/models/student.test.js
jest.dontMock('../../app/models/student.js')
jest.dontMock('immutable')
jest.dontMock('lodash')
jest.dontMock('../../app/models/demoStudent.json')
import Student from '../../app/models/student.js'
import {List, Map} from 'immutable'
import demoStudent from '../../app/models/demoStudent.json'
import {zipObject, pluck, chain, groupBy} from 'lodash'

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

		expect(stu).toBeDefined()
		expect(id).toBeDefined()
		expect(matriculation).toBe(2012)
		expect(graduation).toBe(2016)
		expect(studies.toList().toJSON()).toEqual(demoStudent.studies)
		expect(schedules.toList().toJSON()).toEqual(demoStudent.schedules)
		expect(fabrications.toJS()).toEqual(demoStudent.fabrications)
		expect(settings.toJS()).toEqual(demoStudent.settings)
		expect(creditsNeeded).toEqual(35)

		let keys = pluck(demoStudent.overrides, 'what')
		let demoOverrides = zipObject(keys, demoStudent.overrides)
		expect(overrides.toJSON()).toEqual(demoOverrides)
	})

	it('can turn into JSON', () => {
		let result = JSON.stringify(stu)
		expect(result).toBeTruthy()
	})

	it('returns a promise for data', () => {
		expect(stu.data().then).toBeDefined()
	})

	describe('fabrications', () => {
		it('supports adding fabrications', () => {
			let addedFabrication = stu.addFabrication({id: 'a'})
			expect(addedFabrication.fabrications.get('a')).toEqual({id: 'a'})
		})
		it('supports removing fabrications', () => {
			let addedFabrication = stu.addFabrication({id: 'a'})
			let noMoreFabrication = stu.removeFabrication('a')
			expect(noMoreFabrication.fabrications.has('a')).toBe(false)
		})
	})
	describe('overrides', () => {
		it('supports adding overrides', () => {
			let addedOverride = stu.addOverride({what: 'nothing', with: 'me!'})
			expect(addedOverride.overrides.get('nothing')).toEqual({what: 'nothing', with: 'me!'})
		})
		it('supports removing overrides', () => {
			let removedOverride = stu.removeOverride('credits.taken')
			expect(removedOverride.overrides.get('credits.taken')).not.toBeDefined()
		})
	})
	describe('areas', () => {
		it('can get areas grouped by type', () => {
			expect(typeof stu.areasByType).toBe('object')
		})
		it('supports adding areas', () => {
			let newArea = stu.addArea({id: 'm-esth', revisionYear: 2014})
			expect(newArea.studies.get('m-esth')).toBeDefined()
		})
		it('supports removing areas', () => {
			let noCsci = stu.removeArea('m-csci')
			expect(noCsci.studies.get('m-csci')).not.toBeDefined()
		})
		it('supports removing multiple areas at one time', () => {
			let noCsci = stu
				.removeArea('m-csci')
				.addArea({id: 'm-esth', revisionYear: 2014})
			let noEsth = noCsci.removeArea('m-esth')
			expect(noEsth.studies.get('m-csci')).not.toBeDefined()
			expect(noEsth.studies.get('m-esth')).not.toBeDefined()
		})
	})
	describe('courses', () => {
		xit('returns only courses from active schedules', () => {
			// disabled until we can mock getCourses
			let courseCountFromActive = chain(demoStudent.schedules).filter('active').pluck('clbids').size().value()
			stu.courses.then(courses => expect(courses.length).toBe(courseCountFromActive))
		})
		xit('counts all credits currently scheduled', () => {
			// disabled until we can mock getCourses
			// plus, I'm not even sure how to check the result. lodash?
			stu.courseCredits.then(credits => expect(credits).toBeTruthy())
		})
		it('supports moving courses between schedules in one-ish operation', () => {
			let movedCourse = stu.moveCourse(1, 2, 82908)
			expect(movedCourse.schedules.get(1).clbids).not.toContain(82908)
			expect(movedCourse.schedules.get(2).clbids).toContain(82908)
		})
	})
	describe('schedules', () => {
		it('supports grouping schedules by year', () => {
			expect(typeof stu.schedulesByYear).toBe('object')
		})

		it('supports only returning the active schedules', () => {
			expect(typeof stu.activeSchedules).toBe('object')
		})

		it('supports adding schedules', () => {
			let newSchedule = stu.addSchedule({id: 10912, title: 'a'})
			expect(newSchedule.schedules.get(10912).toJSON()).toEqual({
				id: 10912,
				active: false,
				clbids: [],
				index: 1,
				semester: 0,
				title: 'a',
				year: 0,
			})
		})

		it('supports removing schedules', () => {
			let removedSchedule = stu.destroySchedule(1)
			expect(removedSchedule.schedules.get(1)).toBe(undefined)
		})

		it('supports removing multiple schedules at once', () => {
			let removedSchedule = stu.destroyMultipleSchedules([1, 2])
			expect(removedSchedule.schedules.get(1)).toBe(undefined)
			expect(removedSchedule.schedules.get(2)).toBe(undefined)
		})
	})
	describe('properties', () => {
		it('supports changing the name', () => {
			let newName = stu.changeName('Andrew Joseph Volz')
			expect(newName.name).toBe('Andrew Joseph Volz')
		})

		it('supports changing the number of credits needed', () => {
			let newCredits = stu.changeCreditsNeeded(1)
			expect(newCredits.creditsNeeded).toBe(1)
		})

		it('supports changing the matriculation', () => {
			let newMatriculation = stu.changeMatriculation(1)
			expect(newMatriculation.matriculation).toBe(1)
		})

		it('supports changing the graduation', () => {
			let newGraduation = stu.changeGraduation(1)
			expect(newGraduation.graduation).toBe(1)
		})

		it('supports changing settings', () => {
			let newSetting = stu.changeSetting('setting', 'value')
			expect(newSetting.settings.get('setting')).toBe('value')
		})
	})
})
