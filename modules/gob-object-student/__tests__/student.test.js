// @flow

import demoStudent from '../demo-student.json'
import stringify from 'stabilize'
import {List, Map} from 'immutable'

import {Student} from '../student'
import {Schedule} from '../schedule'

describe('Student', () => {
	it('creates a unique ID for each new student without an ID prop', () => {
		let stu1 = new Student()
		let stu2 = new Student()
		expect(stu1.id).not.toBe(stu2.id)
	})

	it('holds a student', () => {
		let stu = new Student(demoStudent)

		let plain = stu.toJS()

		expect(plain).toBeDefined()
		expect(plain.id).toBeDefined()
		expect(plain.matriculation).toBe(2012)
		expect(plain.graduation).toBe(2016)
		// expect(plain.creditsNeeded).toBe(35)
		expect(plain.studies).toEqual(demoStudent.studies)
		expect(plain.schedules).toEqual(demoStudent.schedules)
		expect(plain.fabrications).toEqual(demoStudent.fabrications)
		expect(plain.settings).toEqual(demoStudent.settings)
		expect(plain.overrides).toEqual(demoStudent.overrides)
	})

	it('turns into JSON', () => {
		let stu = new Student()
		let result = stringify(stu)
		expect(result).toBeTruthy()
	})

	it('turns an array of schedules into an object', () => {
		let id = '123'
		let input = {
			schedules: [{id: id}],
		}

		let student = new Student(input)

		expect(Map.isMap(student.schedules)).toBe(true)
	})

	it('migrates an array of schedules into an object', () => {
		let schedules = Map({
			'1': new Schedule({id: '1'}),
			'2': new Schedule({id: '2'}),
		})
		let stu = new Student({schedules})
		expect(stu.schedules.get('2')).toBeDefined()
		expect(stu.schedules.get('2')).toEqual(schedules.get('2'))
	})
})

describe('addFabricationToStudent', () => {
	it('adds fabrications', () => {
		let stu = new Student()
		let addedFabrication = stu.addFabrication(({clbid: '123'}: any))
		expect(addedFabrication.getFabrication('123')).toEqual({clbid: '123'})
	})
})

describe('removeFabricationFromStudent', () => {
	it('removes fabrications', () => {
		let stu = new Student()
		stu = stu.addFabrication(({clbid: '123'}: any))
		stu = stu.removeFabrication('123')
		expect(stu.getFabrication('123')).not.toBeDefined()
	})
})

describe('setOverrideOnStudent', () => {
	it('adds overrides', () => {
		let stu = new Student()
		let addedOverride = stu.setOverride('nothing', 'me!')
		expect(addedOverride.overrides.get('nothing')).toBe('me!')
	})

	it('sets overrides to falsy values if asked', () => {
		let stu = new Student()
		let addedOverride = stu.setOverride('nothing', false)
		expect(addedOverride.overrides.get('nothing')).toBe(false)
	})
})

describe('removeOverrideFromStudent', () => {
	it('removes overrides', () => {
		let stu = new Student()
		let removedOverride = stu.removeOverride('credits.taken')
		expect(removedOverride.overrides.get('credits.taken')).not.toBeDefined()
	})
})

describe('addAreaToStudent', () => {
	it('adds areas', () => {
		let stu = new Student()
		let query = {
			name: 'Exercise Science',
			type: 'major',
			revision: '2014-15',
		}
		let newArea = stu.addArea(query)
		expect(newArea.hasArea(query)).toBe(true)
	})
})

describe('hasArea', () => {
	it('returns true if an area exists', () => {
		let stu = new Student()
		let query = {
			name: 'Exercise Science',
			type: 'major',
			revision: '2014-15',
		}
		let newArea = stu.addArea(query)
		expect(newArea.hasArea(query)).toBe(true)
	})

	it('returns false if an area does not exist', () => {
		let stu = new Student()
		let query = {
			name: 'Exercise Science',
			type: 'major',
			revision: '2014-15',
		}
		let newArea = stu.addArea(query)
		let failedQuery = {...query, revision: '2015-16'}
		expect(newArea.hasArea(failedQuery)).toBe(false)
	})
})

describe('removeAreaFromStudent', () => {
	it('removes areas', () => {
		let stu = new Student()
		let query = {
			type: 'major',
			name: 'Computer Science',
			revision: 'latest',
		}
		stu = stu.addArea(query)
		let noCsci = stu.removeArea(query)
		expect(stu.hasArea(query)).toBe(true)
		expect(noCsci.hasArea(query)).toBe(false)
	})
})

describe('moveCourseToSchedule', () => {
	it('moves courses between schedules in one-ish operation', () => {
		let stu = new Student({
			schedules: Map([
				['1', new Schedule({clbids: List.of('a-course')})],
				['2', new Schedule({clbids: List()})],
			]),
		})

		let movedCourse = stu.moveCourseToSchedule({
			from: '1',
			to: '2',
			clbid: 'a-course',
		})

		// $FlowExpectedError
		let sched1: Schedule = movedCourse.schedules.get('1')

		// $FlowExpectedError
		let sched2: Schedule = movedCourse.schedules.get('2')

		expect(sched1.clbids).not.toContain('a-course')
		expect(sched2.clbids).toContain('a-course')
	})
})

describe('addScheduleToStudent', () => {
	it('adds schedules', () => {
		let stu = new Student()
		let newSchedule = stu.addSchedule(
			new Schedule({
				id: '10912',
				title: 'a',
				active: false,
				clbids: List(),
				index: 1,
				semester: 0,
				year: 0,
			}),
		)

		// $FlowExpectedError
		let sched: Schedule = newSchedule.schedules.get('10912')

		expect(sched).toMatchInlineSnapshot(`
Immutable.Record {
  "id": "10912",
  "active": false,
  "index": 1,
  "title": "a",
  "clbids": Immutable.List [],
  "year": 0,
  "semester": 0,
  "metadata": Immutable.Map {},
}
`)
	})
})

describe('destroyScheduleFromStudent', () => {
	it('removes schedules', () => {
		let sched = new Schedule()
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let removedSchedule = initial.destroySchedule(sched.id)
		expect(removedSchedule.schedules.get(sched.id)).not.toBeDefined()
	})

	it('makes another schedule active if there is another schedule available for the same term', () => {
		let sched1 = new Schedule({
			year: 2012,
			semester: 1,
			index: 1,
			active: true,
		})
		let sched2 = new Schedule({year: 2012, semester: 1, index: 2})

		let stu = new Student()
		stu = stu.addSchedule(sched1)
		stu = stu.addSchedule(sched2)

		let removedSchedule = stu.destroySchedule(sched1.id)

		// $FlowExpectedError
		let extracted: Schedule = removedSchedule.schedules.get(sched2.id)

		expect(extracted).toBeDefined()
		expect(extracted.active).toBe(true)
	})

	it(`throws if it cannot find the requested schedule id`, () => {
		let stu = new Student({schedules: Map()})
		let shouldThrowBecauseNotAdded = () => stu.destroySchedule('unknown')
		expect(shouldThrowBecauseNotAdded).toThrowError(ReferenceError)
	})
})


describe('destroySchedulesForYear', () => {
	it('removes schedules', () => {
		let sched1 = new Schedule({year: 2014, semester: 1})
		let sched2 = new Schedule({year: 2014, semester: 2})
		let initial = new Student({schedules: Map({[sched1.id]: sched1, [sched2.id]: sched2})})

		let removedSchedule = initial.destroySchedulesForYear(2014)
		expect(removedSchedule.schedules.size).toBe(0)
	})
})

describe('destroySchedulesForTerm', () => {
	it('removes schedules', () => {
		let sched1 = new Schedule({year: 2014, semester: 1})
		let sched2 = new Schedule({year: 2014, semester: 2})
		let initial = new Student({schedules: Map({[sched1.id]: sched1, [sched2.id]: sched2})})

		let actual = initial.destroySchedulesForTerm({year: 2014, semester: 1})

		expect(actual.schedules.get(sched1.id)).not.toBeDefined()
		expect(actual.schedules.get(sched2.id)).toBeDefined()
	})
})


describe('changeStudentName', () => {
	it(`changes the student's name`, () => {
		let initial = new Student()
		let actual = initial.setName('my name')
		expect(actual.name).toBeDefined()
		expect(actual.name).toBe('my name')
	})

	it('returns a new object', () => {
		let initial = new Student()
		let final = initial.setName('')
		expect(final).not.toBe(initial)
	})
})

describe('changeStudentAdvisor', () => {
	it(`changes the student's advisor`, () => {
		let initial = new Student()
		let actual = initial.setAdvisor('professor name')
		expect(actual.advisor).toBeDefined()
		expect(actual.advisor).toBe('professor name')
	})

	it('returns a new object', () => {
		let initial = new Student()
		let final = initial.setAdvisor('')
		expect(final).not.toBe(initial)
	})

	it("unless the value hasn't changed", () => {
		let initial = new Student({advisor: ''})
		let final = initial.setAdvisor('')
		expect(final).toBe(initial)
	})
})

xdescribe('changeStudentCreditsNeeded', () => {
	it(`changes the student's number of credits needed`, () => {
		let initial = new Student()
		// $FlowFixMe once we have a new way of doing credits
		let actual = initial.setCreditsNeeded(initial, 130)
		expect(actual.creditsNeeded).toBeDefined()
		expect(actual.creditsNeeded).toBe(130)
	})

	it('returns a new object', () => {
		let initial = new Student()
		// $FlowFixMe once we have a new way of doing credits
		let final = initial.setCreditsNeeded(0)
		expect(final).not.toBe(initial)
	})
})

describe('changeStudentMatriculation', () => {
	it(`changes the student's matriculation year`, () => {
		let initial = new Student()
		let actual = initial.setMatriculation(1800)
		expect(actual.matriculation).toBeDefined()
		expect(actual.matriculation).toBe(1800)
	})

	it('returns a new object', () => {
		let initial = new Student()
		let final = initial.setMatriculation(0)
		expect(final).not.toBe(initial)
	})
})

describe('changeStudentGraduation', () => {
	it(`changes the student's graduation year`, () => {
		let initial = new Student()
		let actual = initial.setGraduation(2100)
		expect(actual.graduation).toBe(2100)
	})

	it('returns a new object', () => {
		let initial = new Student()
		let final = initial.setGraduation(0)
		expect(final).not.toBe(initial)
	})
})

describe('changeStudentSetting', () => {
	it(`changes settings in the student `, () => {
		let initial = new Student()
		let actual = initial.setSetting('key', 'value')
		expect(actual.settings).toBeDefined()
		expect(actual.settings).toEqual(Map({key: 'value'}))
	})

	it('returns a new object', () => {
		let initial = new Student()
		let final = initial.setSetting('key', 'value2')
		expect(final).not.toBe(initial)
	})
})

describe('moveScheduleInStudent', () => {
	it('moves both a year and a semester', () => {
		let sched = new Schedule({year: 2012, semester: 1})
		let stu = new Student({schedules: Map({[sched.id]: sched})})
		let actual = stu.moveSchedule(sched.id, {
			year: 2014,
			semester: 3,
		})

		// $FlowExpectedError
		let plucked: Schedule = actual.schedules.get(sched.id)

		expect(plucked.year).toBe(2014)
		expect(plucked.semester).toBe(3)
	})

	it('returns a new object', () => {
		let sched = new Schedule({year: 2012})
		let stu = new Student({schedules: Map({[sched.id]: sched})})

		let actual = stu.moveSchedule(sched.id, {year: 2014, semester: 2})

		// $FlowExpectedError
		let plucked: Schedule = actual.schedules.get(sched.id)

		expect(plucked).not.toBe(sched)
	})
})

describe('reorderScheduleInStudent', () => {
	it('changes the "index" property', () => {
		let sched = new Schedule({index: 0})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let actual = initial.reorderSchedule(sched.id, 5)

		// $FlowExpectedError
		let plucked: Schedule = actual.schedules.get(sched.id)

		expect(plucked.index).toBe(5)
	})

	it('returns a new object', () => {
		let sched = new Schedule({index: 0})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let actual = initial.reorderSchedule(sched.id, 5)

		// $FlowExpectedError
		let plucked: Schedule = actual.schedules.get(sched.id)

		expect(actual).not.toBe(initial)
		expect(plucked).not.toBe(sched)
	})
})

describe('renameScheduleInStudent', () => {
	it('renames the schedule', () => {
		let sched = new Schedule({title: 'Initial Title'})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let actual = initial.renameSchedule(sched.id, 'My New Title')

		// $FlowExpectedError
		let plucked: Schedule = actual.schedules.get(sched.id)

		expect(plucked.title).toBe('My New Title')
	})

	it('returns a new object', () => {
		let sched = new Schedule({title: 'Initial Title'})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let actual = initial.renameSchedule(sched.id, 'My New Title')

		// $FlowExpectedError
		let plucked: Schedule = actual.schedules.get(sched.id)

		expect(actual).not.toBe(initial)
		expect(plucked).not.toBe(sched)
	})
})

describe('addCourseToSchedule', () => {
	it('adds a course', () => {
		let sched = new Schedule({clbids: List(['123'])})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let addedCourse = initial.addCourseToSchedule(sched.id, '918')

		// $FlowExpectedError
		let plucked: Schedule = addedCourse.schedules.get(sched.id)

		expect(plucked.clbids).toContain('918')
	})

	it('returns a new object', () => {
		let sched = new Schedule({clbids: List(['123123'])})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let actual = initial.addCourseToSchedule(sched.id, 'a-new-course')

		// $FlowExpectedError
		let plucked: Schedule = actual.schedules.get(sched.id)
		// $FlowExpectedError
		let initialPlucked: Schedule = initial.schedules.get(sched.id)

		expect(actual).not.toBe(initial)
		expect(plucked).not.toBe(initialPlucked)
		expect(plucked).not.toBe(sched)
	})

	it('returns the same student if the clbid already exists in the schedule', () => {
		let sched = new Schedule({clbids: List(['123'])})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		expect(initial.addCourseToSchedule(sched.id, '123')).toBe(initial)
	})
})

describe('removeCourseFromSchedule', () => {
	it('removes a course', () => {
		let sched = new Schedule({clbids: List(['123'])})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let removedCourse = initial.removeCourseFromSchedule(sched.id, '123')

		// $FlowExpectedError
		let plucked: Schedule = removedCourse.schedules.get(sched.id)

		expect(plucked.clbids).not.toContain('123')
	})

	it('returns a new object', () => {
		let sched = new Schedule({clbids: List(['123'])})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let actual = initial.removeCourseFromSchedule(sched.id, '123')

		// $FlowExpectedError
		let plucked: Schedule = actual.schedules.get(sched.id)
		// $FlowExpectedError
		let initialPlucked: Schedule = initial.schedules.get(sched.id)

		expect(actual).not.toBe(initial)
		expect(plucked).not.toBe(initialPlucked)
		expect(plucked).not.toBe(sched)
	})

	it('returns the same student if the clbid does not exist in the schedule', () => {
		let sched = new Schedule({clbids: List(['123123123'])})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		expect(
			initial.removeCourseFromSchedule(sched.id, 'something-else'),
		).toBe(initial)
	})
})

describe('reorderCourseInSchedule', () => {
	it('rearranges courses', () => {
		let sched = new Schedule({clbids: List(['123', '456', '789'])})
		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let actual = initial.reorderCourseInSchedule(sched.id, {
			clbid: '123',
			index: 1,
		})

		// $FlowExpectedError
		let plucked: Schedule = actual.schedules.get(sched.id)

		expect(plucked.clbids).not.toEqual(List.of('123', '456', '789'))
		expect(plucked.clbids).toEqual(List.of('456', '123', '789'))
	})

	it('returns a new object', () => {
		let sched = new Schedule({clbids: List(['123', '456', '789'])})

		let initial = new Student({schedules: Map({[sched.id]: sched})})
		let actual = initial.reorderCourseInSchedule(sched.id, {
			clbid: '123',
			index: 1,
		})

		expect(actual).not.toBe(initial)

		// $FlowExpectedError
		let plucked: Schedule = actual.schedules.get(sched.id)
		// $FlowExpectedError
		let initialPlucked: Schedule = initial.schedules.get(sched.id)

		expect(plucked).not.toBe(initialPlucked)
		expect(plucked).not.toBe(sched)
	})

	it('requires that the clbid to be moved actually appear in the list of clbids', () => {
		let sched = new Schedule({clbids: List(['123', '456', '789'])})
		let stu = new Student({schedules: Map({[sched.id]: sched})})
		expect(() =>
			stu.reorderCourseInSchedule(sched.id, {
				clbid: '123456789',
				index: 0,
			}),
		).toThrowError(ReferenceError)
	})

	it('truncates the requested index if it is greater than the number of courses', () => {
		let sched = new Schedule({clbids: List(['123456789', '123'])})
		let stu = new Student({schedules: Map({[sched.id]: sched})})
		let reordered = stu.reorderCourseInSchedule(sched.id, {
			clbid: '123456789',
			index: 10,
		})

		// $FlowExpectedError
		let plucked: Schedule = reordered.schedules.get(sched.id)

		expect(plucked.clbids.findIndex(c => c === '123456789')).toBe(1)
	})

	it('truncates the requested index if it is Infinity', () => {
		let sched = new Schedule({clbids: List(['123456789', '123'])})
		let stu = new Student({schedules: Map({[sched.id]: sched})})
		let reordered = stu.reorderCourseInSchedule(sched.id, {
			clbid: '123456789',
			index: Infinity,
		})

		// $FlowExpectedError
		let plucked: Schedule = reordered.schedules.get(sched.id)

		expect(plucked.clbids.findIndex(c => c === '123456789')).toBe(1)
	})

	it('truncates the requested index if it is less than 0', () => {
		let sched = new Schedule({clbids: List(['123456789', '123'])})
		let stu = new Student({schedules: Map({[sched.id]: sched})})
		let reordered = stu.reorderCourseInSchedule(sched.id, {
			clbid: '123',
			index: -10,
		})

		// $FlowExpectedError
		let plucked: Schedule = reordered.schedules.get(sched.id)

		expect(plucked.clbids.findIndex(c => c === '123')).toBe(0)
	})
})
