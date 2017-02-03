import demoStudent from '../demo-student.json'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import stringify from 'stabilize'

import {
	Student,
	changeStudentName,
	changeStudentAdvisor,
	changeStudentCreditsNeeded,
	changeStudentMatriculation,
	changeStudentGraduation,
	changeStudentSetting,
	addScheduleToStudent,
	destroyScheduleFromStudent,
	addCourseToSchedule,
	removeCourseFromSchedule,
	moveCourseToSchedule,
	addAreaToStudent,
	removeAreaFromStudent,
	setOverrideOnStudent,
	removeOverrideFromStudent,
	addFabricationToStudent,
	removeFabricationFromStudent,
	moveScheduleInStudent,
	reorderScheduleInStudent,
	renameScheduleInStudent,
	reorderCourseInSchedule,
} from '../student'

import { Schedule } from '../schedule'

describe('Student', () => {
	it('returns an object', () => {
		expect(typeof Student()).toBe('object')
	})

	it('creates a unique ID for each new student without an ID prop', () => {
		let stu1 = Student()
		let stu2 = Student()
		expect(stu1.id).not.toBe(stu2.id)
	})

	it('holds a student', () => {
		const stu = Student(demoStudent)

		expect(stu).toBeDefined()
		expect(stu.id).toBeDefined()
		expect(stu.matriculation).toBe(2012)
		expect(stu.graduation).toBe(2016)
		expect(stu.creditsNeeded).toBe(35)
		expect(stu.studies).toEqual(demoStudent.studies)
		expect(stu.schedules).toEqual(demoStudent.schedules)
		expect(stu.fabrications).toEqual(demoStudent.fabrications)
		expect(stu.settings).toEqual(demoStudent.settings)
		expect(stu.overrides).toEqual(demoStudent.overrides)
	})

	it('turns into JSON', () => {
		const stu = Student()
		let result = stringify(stu)
		expect(result).toBeTruthy()
	})

	it('migrates an array of schedules into an object', () => {
		const schedules = [Schedule({ id: '1' }), Schedule({ id: '2' })]
		const stu = Student({ schedules })
		expect('2' in stu.schedules).toBe(true)
		expect(stu.schedules['2']).toEqual(schedules[1])
	})
})

describe('addFabricationToStudent', () => {
	it('adds fabrications', () => {
		const stu = Student()
		const addedFabrication = addFabricationToStudent(stu, { clbid: '123' })
		expect(addedFabrication.fabrications['123']).toEqual({ clbid: '123' })
	})

	it('requires that fabrications include a clbid', () => {
		const stu = Student()
		const goodFab = { clbid: 'fab!', title: 'I\'m a fabrication!' }
		expect(() => addFabricationToStudent(stu, goodFab)).not.toThrow()
		const badFab = { title: "I'm a fabrication!" }
		expect(() => addFabricationToStudent(stu, badFab)).toThrowError(ReferenceError)
	})

	it('requires that fabrication clbids be strings', () => {
		const stu = Student()
		const goodFab = { clbid: 'fab!', title: 'I\'m a fabrication!' }
		expect(() => addFabricationToStudent(stu, goodFab)).not.toThrow()
		const badFab = { clbid: 12345, title: 'I\'m a fabrication!' }
		expect(() => addFabricationToStudent(stu, badFab)).toThrowError(TypeError)
	})
})

describe('removeFabricationFromStudent', () => {
	it('removes fabrications', () => {
		const stu = Student(demoStudent)
		let addedFabrication = addFabricationToStudent(stu, { clbid: '123' })
		let noMoreFabrication = removeFabricationFromStudent(addedFabrication, '123')
		expect(noMoreFabrication.fabrications.hasOwnProperty('a')).toBe(false)
	})

	it('requires the fabricationId to be a string', () => {
		const stu = Student()
		const stuWithFab = addFabricationToStudent(stu, { clbid: 'fab!', title: 'I\'m a fabrication!' })
		expect(() => removeFabricationFromStudent(stuWithFab, 123)).toThrowError(TypeError)
	})
})

describe('setOverrideOnStudent', () => {
	it('adds overrides', () => {
		const stu = Student()
		let addedOverride = setOverrideOnStudent(stu, 'nothing', 'me!')
		expect(addedOverride.overrides['nothing']).toBe('me!')
	})

	it('sets overrides to falsy values if asked', () => {
		const stu = Student()
		let addedOverride = setOverrideOnStudent(stu, 'nothing', false)
		expect(addedOverride.overrides['nothing']).toBe(false)
	})
})

describe('removeOverrideFromStudent', () => {
	it('removes overrides', () => {
		const stu = Student(demoStudent)
		let removedOverride = removeOverrideFromStudent(stu, 'credits.taken')
		expect(removedOverride.overrides['credits.taken']).not.toBeDefined()
	})
})

describe('addAreaToStudent', () => {
	it('adds areas', () => {
		const stu = Student()
		let query = { name: 'Exercise Science', type: 'major', revision: '2014-15' }
		let newArea = addAreaToStudent(stu, query)
		expect(find(newArea.studies, query)).toBeDefined()
	})
})

describe('removeAreaFromStudent', () => {
	it('removes areas', () => {
		const stu = Student(demoStudent)
		let query = { type: 'major', name: 'Computer Science', revision: 'latest' }
		let noCsci = removeAreaFromStudent(stu, query)
		expect(find(noCsci.studies, query)).not.toBeDefined()
	})
})

describe('moveCourseToSchedule', () => {
	it('moves courses between schedules in one-ish operation', () => {
		const stu = Student(demoStudent)
		let movedCourse = moveCourseToSchedule(stu, { fromScheduleId: '1', toScheduleId: '2', clbid: 82908 })
		expect(movedCourse.schedules['1'].clbids).not.toContain(82908)
		expect(movedCourse.schedules['2'].clbids).toContain(82908)
	})
})

describe('addScheduleToStudent', () => {
	it('adds schedules', () => {
		const stu = Student()
		let newSchedule = addScheduleToStudent(stu, Schedule({
			id: '10912',
			title: 'a',
			active: false,
			clbids: [],
			index: 1,
			semester: 0,
			year: 0,
		}))
		expect(newSchedule.schedules['10912']).toEqual({
			id: '10912',
			active: false,
			clbids: [],
			index: 1,
			semester: 0,
			title: 'a',
			year: 0,
			metadata: {},
		})
	})

	it(`requires that the student's schedules not be in an array`, () => {
		const stu = { schedules: [] }
		let shouldThrowBecauseArray = () => addScheduleToStudent(stu, Schedule())
		expect(shouldThrowBecauseArray).toThrowError(TypeError)
	})
})

describe('destroyScheduleFromStudent', () => {
	it('removes schedules', () => {
		const sched = Schedule()
		const stu = addScheduleToStudent(Student(), sched)
		let removedSchedule = destroyScheduleFromStudent(stu, sched.id)
		expect(removedSchedule.schedules[sched.id]).not.toBeDefined()
	})

	it('makes another schedule active if there is another schedule available for the same term', () => {
		const sched1 = Schedule({ year: 2012, semester: 1, index: 1, active: true })
		const sched2 = Schedule({ year: 2012, semester: 1, index: 2 })
		let stu = Student()
		stu = addScheduleToStudent(stu, sched1)
		stu = addScheduleToStudent(stu, sched2)

		let removedSchedule = destroyScheduleFromStudent(stu, sched1.id)
		expect(removedSchedule.schedules[sched2.id].active).toBeDefined()
		expect(removedSchedule.schedules[sched2.id].active).toBe(true)
	})

	it(`requires that the student's schedules not be in an array`, () => {
		const sched = Schedule()
		const stu = { schedules: [sched] }
		let shouldThrowBecauseArray = () => destroyScheduleFromStudent(stu, sched.id)
		expect(shouldThrowBecauseArray).toThrowError(TypeError)
	})

	it(`throws if it cannot find the requested schedule id`, () => {
		const sched = Schedule()
		const stu = { schedules: {} }
		let shouldThrowBecauseNotAdded = () => destroyScheduleFromStudent(stu, sched.id)
		expect(shouldThrowBecauseNotAdded).toThrowError(ReferenceError)
	})
})


describe('changeStudentName', () => {
	it(`changes the student's name`, () => {
		let initial = Student()
		const actual = changeStudentName(initial, 'my name')
		expect(actual.name).toBeDefined()
		expect(actual.name).toBe('my name')
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentName(initial)
		expect(final).not.toBe(initial)
	})
})

describe('changeStudentAdvisor', () => {
	it(`changes the student's advisor`, () => {
		let initial = Student()
		const actual = changeStudentAdvisor(initial, 'professor name')
		expect(actual.advisor).toBeDefined()
		expect(actual.advisor).toBe('professor name')
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentAdvisor(initial)
		expect(final).not.toBe(initial)
	})
})

describe('changeStudentCreditsNeeded', () => {
	it(`changes the student's number of credits needed`, () => {
		let initial = Student()
		const actual = changeStudentCreditsNeeded(initial, 130)
		expect(actual.creditsNeeded).toBeDefined()
		expect(actual.creditsNeeded).toBe(130)
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentCreditsNeeded(initial)
		expect(final).not.toBe(initial)
	})
})

describe('changeStudentMatriculation', () => {
	it(`changes the student's matriculation year`, () => {
		let initial = Student()
		const actual = changeStudentMatriculation(initial, 1800)
		expect(actual.matriculation).toBeDefined()
		expect(actual.matriculation).toBe(1800)
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentMatriculation(initial)
		expect(final).not.toBe(initial)
	})
})

describe('changeStudentGraduation', () => {
	it(`changes the student's graduation year`, () => {
		let initial = Student()
		const actual = changeStudentGraduation(initial, 2100)
		expect(actual.graduation).toBeDefined()
		expect(actual.graduation).toBe(2100)
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentGraduation(initial)
		expect(final).not.toBe(initial)
	})
})

describe('changeStudentSetting', () => {
	it(`changes settings in the student `, () => {
		let initial = Student()
		const actual = changeStudentSetting(initial, 'key', 'value')
		expect(actual.settings).toBeDefined()
		expect(actual.settings).toEqual({ key: 'value' })
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentSetting(initial, 'key', 'value2')
		expect(final).not.toBe(initial)
	})
})



describe('moveScheduleInStudent', () => {
	it('throws if not given anywhere to move to', () => {
		expect(() => moveScheduleInStudent({}, '', {}))
			.toThrowError(RangeError)
	})

	it('moves just a year', () => {
		let sched = Schedule({ year: 2012 })
		let stu = { schedules: { [sched.id]: sched } }
		let actual = moveScheduleInStudent(stu, sched.id, { year: 2014 })
		expect(actual.schedules[sched.id].year).toBe(2014)
	})

	it('moves just a semester', () => {
		let sched = Schedule({ semester: 1 })
		let stu = { schedules: { [sched.id]: sched } }
		let actual = moveScheduleInStudent(stu, sched.id, { semester: 3 })
		expect(actual.schedules[sched.id].semester).toBe(3)
	})

	it('moves both a year and a semester', () => {
		let sched = Schedule({ year: 2012, semester: 1 })
		let stu = { schedules: { [sched.id]: sched } }
		let actual = moveScheduleInStudent(stu, sched.id, { year: 2014, semester: 3 })
		expect(actual.schedules[sched.id].year).toBe(2014)
		expect(actual.schedules[sched.id].semester).toBe(3)
	})

	it('throws if year is not a number', () => {
		let sched = Schedule()
		let stu = { schedules: { [sched.id]: sched } }
		expect(() => moveScheduleInStudent(stu, sched.id, { year: '2014' }))
			.toThrowError(TypeError)
	})

	it('throws if semester is not a number', () => {
		let sched = Schedule()
		let stu = { schedules: { [sched.id]: sched } }
		expect(() => moveScheduleInStudent(stu, sched.id, { semester: '5' }))
			.toThrowError(TypeError)
	})

	it('returns a new object', () => {
		let sched = Schedule({ year: 2012 })
		let actual = moveScheduleInStudent({ schedules: { [sched.id]: sched } }, sched.id, { year: 2014 })
		expect(actual.schedules[sched.id]).not.toBe(sched)
	})

	it('throws if the schedule id cannot be found', () => {
		let sched = Schedule()
		let stu = { schedules: {} }
		expect(() => moveScheduleInStudent(stu, sched.id, { year: 2000 }))
			.toThrowError(ReferenceError)
	})
})

describe('reorderScheduleInStudent', () => {
	it('changes the "index" property', () => {
		let sched = Schedule({ index: 0 })
		let stu = { schedules: { [sched.id]: sched } }
		let newOrder = reorderScheduleInStudent(stu, sched.id, 5)
		expect(newOrder.schedules[sched.id].index).toBe(5)
	})

	it('returns a new object', () => {
		let sched = Schedule({ index: 0 })
		let stu = { schedules: { [sched.id]: sched } }
		let newOrder = reorderScheduleInStudent(stu, sched.id, 5)
		expect(newOrder).not.toBe(stu)
		expect(newOrder.schedules[sched.id]).not.toBe(sched)
	})

	it('throws if the schedule id cannot be found', () => {
		let sched = Schedule()
		let stu = { schedules: {} }
		expect(() => reorderScheduleInStudent(stu, sched.id, 3))
			.toThrowError(ReferenceError)
	})
})

describe('renameScheduleInStudent', () => {
	it('renames the schedule', () => {
		let sched = Schedule({ title: 'Initial Title' })
		let stu = { schedules: { [sched.id]: sched } }
		let newOrder = renameScheduleInStudent(stu, sched.id, 'My New Title')
		expect(newOrder.schedules[sched.id].title).toBe('My New Title')
	})

	it('returns a new object', () => {
		let sched = Schedule({ title: 'Initial Title' })
		let stu = { schedules: { [sched.id]: sched } }
		let newOrder = renameScheduleInStudent(stu, sched.id, 'My New Title')
		expect(newOrder).not.toBe(stu)
		expect(newOrder.schedules[sched.id]).not.toBe(sched)
	})

	it('throws if the schedule id cannot be found', () => {
		let sched = Schedule()
		let stu = { schedules: {} }
		expect(() => renameScheduleInStudent(stu, sched.id, 'third'))
			.toThrowError(ReferenceError)
	})
})

describe('addCourseToSchedule', () => {
	it('adds a course', () => {
		const sched = Schedule()
		const stu = addScheduleToStudent(Student(), sched)
		let addedCourse = addCourseToSchedule(stu, sched.id, 918)
		expect(addedCourse.schedules[sched.id].clbids).toContain(918)
	})

	it('refuses to add non-number clbids', () => {
		const sched = Schedule()
		const stu = addScheduleToStudent(Student(), sched)
		expect(() => addCourseToSchedule(stu, sched.id, '918'))
			.toThrowError(TypeError)
	})

	it('returns a new object', () => {
		const sched = Schedule()
		const stu = addScheduleToStudent(Student(), sched)
		let actual = addCourseToSchedule(stu, sched.id, 918)
		expect(actual).not.toBe(stu)
		expect(actual.schedules[sched.id]).not.toBe(stu.schedules[sched.id])
		expect(actual.schedules[sched.id]).not.toBe(sched)
	})

	it('returns the same student if the clbid already exists in the schedule', () => {
		const sched = Schedule({ clbids: [456] })
		const stu = addScheduleToStudent(Student(), sched)
		expect(addCourseToSchedule(stu, sched.id, 456)).toBe(stu)
	})

	it('throws an error if the schedule cannot be found', () => {
		let sched = Schedule({ clbids: [456] })
		let stu = addScheduleToStudent(Student(), sched)
		expect(() => addCourseToSchedule(stu, sched.id + 'bad', 456))
			.toThrowError(ReferenceError)
	})
})

describe('removeCourseFromSchedule', () => {
	it('removes a course', () => {
		const sched = Schedule({ clbids: [123] })
		const stu = addScheduleToStudent(Student(), sched)
		let removedCourse = removeCourseFromSchedule(stu, sched.id, 123)
		expect(removedCourse.schedules[sched.id].clbids).not.toContain(123)
	})

	it('refuses to remove non-number clbids', () => {
		const sched = Schedule({ clbids: [123] })
		const stu = addScheduleToStudent(Student(), sched)
		expect(() => removeCourseFromSchedule(stu, sched.id, '918'))
			.toThrowError(TypeError)
	})

	it('returns a new object', () => {
		const sched = Schedule({ clbids: [123] })
		const stu = addScheduleToStudent(Student(), sched)
		const actual = removeCourseFromSchedule(stu, sched.id, 123)
		expect(actual).not.toBe(stu)
		expect(actual.schedules[sched.id]).not.toBe(stu.schedules[sched.id])
		expect(actual.schedules[sched.id]).not.toBe(sched)
	})

	it('returns the same student if the clbid does not exist in the schedule', () => {
		let sched = Schedule({ clbids: [] })
		let stu = addScheduleToStudent(Student(), sched)
		expect(removeCourseFromSchedule(stu, sched.id, 123)).toBe(stu)
	})

	it('throws an error if the schedule cannot be found', () => {
		let sched = Schedule({ clbids: [456] })
		let stu = addScheduleToStudent(Student(), sched)
		expect(() => removeCourseFromSchedule(stu, sched.id + 'bad', 456))
			.toThrowError(ReferenceError)
	})
})

describe('reorderCourseInSchedule', () => {
	it('rearranges courses', () => {
		const sched = Schedule({ clbids: [123, 456, 789] })
		const stu = addScheduleToStudent(Student(), sched)
		let rearranged = reorderCourseInSchedule(stu, sched.id, { clbid: 123, index: 1 })
		expect(rearranged.schedules[sched.id].clbids).not.toEqual([123, 456, 789])
		expect(rearranged.schedules[sched.id].clbids).toEqual([456, 123, 789])
	})

	it('requires that the clbid be a number', () => {
		const sched = Schedule({ clbids: [123, 456, 789] })
		const stu = addScheduleToStudent(Student(), sched)
		expect(() => reorderCourseInSchedule(stu, sched.id, { clbid: '123', index: 1 })).toThrowError(TypeError)
	})

	it('returns a new object', () => {
		const sched = Schedule({ clbids: [123, 456, 789] })
		const stu = addScheduleToStudent(Student(), sched)
		let actual = reorderCourseInSchedule(stu, sched.id, { clbid: 123, index: 1 })
		expect(actual).not.toBe(stu)
		expect(actual.schedules[sched.id]).not.toBe(stu.schedules[sched.id])
		expect(actual.schedules[sched.id]).not.toBe(sched)
	})

	it('requires that the clbid to be moved actually appear in the list of clbids', () => {
		const sched = Schedule({ clbids: [123, 456, 789] })
		const stu = addScheduleToStudent(Student(), sched)
		expect(() => reorderCourseInSchedule(stu, sched.id, { clbid: 123456789, index: 0 }))
			.toThrowError(ReferenceError)
	})

	it('throws if the schedule id cannot be found', () => {
		let sched = Schedule({ clbids: [123456789, 123] })
		let stu = { schedules: { [sched.id]: sched } }
		expect(() => reorderCourseInSchedule(stu, sched.id + 'bad', { clbid: 123, index: 0 }))
			.toThrowError(ReferenceError)
	})

	it('truncates the requested index if it is greater than the number of courses', () => {
		let sched = Schedule({ clbids: [123456789, 123] })
		let stu = { schedules: { [sched.id]: sched } }
		let reordered = reorderCourseInSchedule(stu, sched.id, { clbid: 123456789, index: 10 })
		expect(findIndex(reordered.schedules[sched.id].clbids, c => c === 123456789)).toBe(1)
	})

	it('truncates the requested index if it is Infinity', () => {
		let sched = Schedule({ clbids: [123456789, 123] })
		let stu = { schedules: { [sched.id]: sched } }
		let reordered = reorderCourseInSchedule(stu, sched.id, { clbid: 123456789, index: Infinity })
		expect(findIndex(reordered.schedules[sched.id].clbids, c => c === 123456789)).toBe(1)
	})

	it('truncates the requested index if it is less than 0', () => {
		let sched = Schedule({ clbids: [123456789, 123] })
		let stu = { schedules: { [sched.id]: sched } }
		let reordered = reorderCourseInSchedule(stu, sched.id, { clbid: 123, index: -10 })
		expect(findIndex(reordered.schedules[sched.id].clbids, c => c === 123)).toBe(0)
	})
})
