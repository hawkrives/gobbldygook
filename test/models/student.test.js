import {expect} from 'chai'
import mock from 'mock-require'
import demoStudent from '../../src/models/demo-student.json'
import find from 'lodash/collection/find'
import findIndex from 'lodash/array/findIndex'
import stringify from 'json-stable-stringify'

mock('../../src/helpers/get-courses', require('../mocks/get-courses.mock').default)
mock('../../src/helpers/load-area', require('../mocks/load-area.mock').default)

const {
	default: Student,
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
} = require('../../src/models/student')

const Schedule = require('../../src/models/schedule').default

describe('Student', () => {
	it('returns an object', () => {
		expect(typeof Student()).to.equal('object')
	})

	it('creates a unique ID for each new student without an ID prop', () => {
		let stu1 = Student()
		let stu2 = Student()
		expect(stu1.id).to.not.equal(stu2.id)
	})

	it('holds a student', () => {
		const stu = Student(demoStudent)

		expect(stu).to.exist
		expect(stu.id).to.exist
		expect(stu.matriculation).to.equal(2012)
		expect(stu.graduation).to.equal(2016)
		expect(stu.creditsNeeded).to.equal(35)
		expect(stu.studies).to.deep.equal(demoStudent.studies)
		expect(stu.schedules).to.deep.equal(demoStudent.schedules)
		expect(stu.fabrications).to.deep.equal(demoStudent.fabrications)
		expect(stu.settings).to.deep.equal(demoStudent.settings)
		expect(stu.overrides).to.deep.equal(demoStudent.overrides)
	})

	it('turns into JSON', () => {
		const stu = Student()
		let result = stringify(stu)
		expect(result).to.be.ok
	})

	it('migrates an array of schedules into an object', () => {
		const schedules = [Schedule({id: '1'}), Schedule({id: '2'})]
		const stu = Student({schedules})
		expect('2' in stu.schedules).to.be.true
		expect(stu.schedules['2']).to.deep.equal(schedules[1])
	})
})

describe('addFabricationToStudent', () => {
	it('adds fabrications', () => {
		const stu = Student()
		const addedFabrication = addFabricationToStudent(stu, {clbid: '123'})
		expect(addedFabrication.fabrications['123']).to.deep.equal({clbid: '123'})
	})

	it('requires that fabrications include a clbid', () => {
		const stu = Student()
		const goodFab = {clbid: 'fab!', title: 'I\'m a fabrication!'}
		expect(() => addFabricationToStudent(stu, goodFab)).to.not.throw
		const badFab = {title: "I'm a fabrication!"}
		expect(() => addFabricationToStudent(stu, badFab)).to.throw(ReferenceError)
	})

	it('requires that fabrication clbids be strings', () => {
		const stu = Student()
		const goodFab = {clbid: 'fab!', title: 'I\'m a fabrication!'}
		expect(() => addFabricationToStudent(stu, goodFab)).to.not.throw
		const badFab = {clbid: 12345, title: 'I\'m a fabrication!'}
		expect(() => addFabricationToStudent(stu, badFab)).to.throw(TypeError)
	})
})

describe('removeFabricationFromStudent', () => {
	it('removes fabrications', () => {
		const stu = Student(demoStudent)
		let addedFabrication = addFabricationToStudent(stu, {clbid: '123'})
		let noMoreFabrication = removeFabricationFromStudent(addedFabrication, '123')
		expect(noMoreFabrication.fabrications.hasOwnProperty('a')).to.be.false
	})

	it('requires the fabricationId to be a string', () => {
		const stu = Student()
		const stuWithFab = addFabricationToStudent(stu, {clbid: 'fab!', title: 'I\'m a fabrication!'})
		expect(() => removeFabricationFromStudent(stuWithFab, 123)).to.throw(TypeError)
	})
})

describe('setOverrideOnStudent', () => {
	it('adds overrides', () => {
		const stu = Student()
		let addedOverride = setOverrideOnStudent(stu, 'nothing', 'me!')
		expect(addedOverride.overrides['nothing']).to.equal('me!')
	})

	it('sets overrides to falsy values if asked', () => {
		const stu = Student()
		let addedOverride = setOverrideOnStudent(stu, 'nothing', false)
		expect(addedOverride.overrides['nothing']).to.equal(false)
	})
})

describe('removeOverrideFromStudent', () => {
	it('removes overrides', () => {
		const stu = Student(demoStudent)
		let removedOverride = removeOverrideFromStudent(stu, 'credits.taken')
		expect(removedOverride.overrides['credits.taken']).to.not.exist
	})
})

describe('addAreaToStudent', () => {
	it('adds areas', () => {
		const stu = Student()
		let query = {name: 'Exercise Science', type: 'major', revision: '2014-15'}
		let newArea = addAreaToStudent(stu, query)
		expect(find(newArea.studies, query)).not.to.be.undefined
	})
})

describe('removeAreaFromStudent', () => {
	it('removes areas', () => {
		const stu = Student(demoStudent)
		let query = {type: 'major', name: 'Computer Science', revision: 'latest'}
		let noCsci = removeAreaFromStudent(stu, query)
		expect(find(noCsci.studies, query)).to.be.undefined
	})
})

describe('moveCourseToSchedule', () => {
	it('moves courses between schedules in one-ish operation', () => {
		const stu = Student(demoStudent)
		let movedCourse = moveCourseToSchedule(stu, {fromScheduleId: '1', toScheduleId: '2', clbid: 82908})
		expect(movedCourse.schedules['1'].clbids).to.not.include(82908)
		expect(movedCourse.schedules['2'].clbids).to.include(82908)
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
		expect(newSchedule.schedules['10912']).to.deep.equal({
			id: '10912',
			active: false,
			clbids: [],
			index: 1,
			semester: 0,
			title: 'a',
			year: 0,
		})
	})

	it(`requires that the student's schedules not be in an array`, () => {
		const stu = {schedules: []}
		let shouldThrowBecauseArray = () => addScheduleToStudent(stu, Schedule())
		expect(shouldThrowBecauseArray).to.throw(TypeError)
	})
})

describe('destroyScheduleFromStudent', () => {
	it('removes schedules', () => {
		const sched = Schedule()
		const stu = addScheduleToStudent(Student(), sched)
		let removedSchedule = destroyScheduleFromStudent(stu, sched.id)
		expect(removedSchedule.schedules[sched.id]).to.be.undefined
	})

	it('makes another schedule active if there is another schedule available for the same term', () => {
		const sched1 = Schedule({year: 2012, semester: 1, index: 1, active: true})
		const sched2 = Schedule({year: 2012, semester: 1, index: 2})
		let stu = Student()
		stu = addScheduleToStudent(stu, sched1)
		stu = addScheduleToStudent(stu, sched2)

		let removedSchedule = destroyScheduleFromStudent(stu, sched1.id)
		expect(removedSchedule.schedules[sched2.id]).to.have.property('active', true)
	})

	it(`requires that the student's schedules not be in an array`, () => {
		const sched = Schedule()
		const stu = {schedules: [sched]}
		let shouldThrowBecauseArray = () => destroyScheduleFromStudent(stu, sched.id)
		expect(shouldThrowBecauseArray).to.throw(TypeError)
	})

	it(`throws if it cannot find the requested schedule id`, () => {
		const sched = Schedule()
		const stu = {schedules: {}}
		let shouldThrowBecauseNotAdded = () => destroyScheduleFromStudent(stu, sched.id)
		expect(shouldThrowBecauseNotAdded).to.throw(ReferenceError)
	})
})


describe('changeStudentName', () => {
	it(`changes the student's name`, () => {
		let initial = Student()
		expect(changeStudentName(initial, 'my name'))
			.to.have.property('name', 'my name')
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentName(initial)
		expect(final).to.not.equal(initial)
	})
})

describe('changeStudentAdvisor', () => {
	it(`changes the student's advisor`, () => {
		let initial = Student()
		expect(changeStudentAdvisor(initial, 'professor name'))
			.to.have.property('advisor', 'professor name')
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentAdvisor(initial)
		expect(final).to.not.equal(initial)
	})
})

describe('changeStudentCreditsNeeded', () => {
	it(`changes the student's number of credits needed`, () => {
		let initial = Student()
		expect(changeStudentCreditsNeeded(initial, 130))
			.to.have.property('creditsNeeded', 130)
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentCreditsNeeded(initial)
		expect(final).to.not.equal(initial)
	})
})

describe('changeStudentMatriculation', () => {
	it(`changes the student's matriculation year`, () => {
		let initial = Student()
		expect(changeStudentMatriculation(initial, 1800))
			.to.have.property('matriculation', 1800)
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentMatriculation(initial)
		expect(final).to.not.equal(initial)
	})
})

describe('changeStudentGraduation', () => {
	it(`changes the student's graduation year`, () => {
		let initial = Student()
		expect(changeStudentGraduation(initial, 2100))
			.to.have.property('graduation', 2100)
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentGraduation(initial)
		expect(final).to.not.equal(initial)
	})
})

describe('changeStudentSetting', () => {
	it(`changes settings in the student `, () => {
		let initial = Student()
		expect(changeStudentSetting(initial, 'key', 'value'))
			.to.have.property('settings')
			.which.deep.equals({key: 'value'})
	})

	it('returns a new object', () => {
		let initial = Student()
		let final = changeStudentSetting(initial)
		expect(final).to.not.equal(initial)
	})
})



describe('moveScheduleInStudent', () => {
	it('throws if not given anywhere to move to', () => {
		expect(() => moveScheduleInStudent({}, '', {}))
			.to.throw(RangeError)
	})

	it('moves just a year', () => {
		let sched = Schedule({year: 2012})
		let stu = {schedules: {[sched.id]: sched}}
		let actual = moveScheduleInStudent(stu, sched.id, {year: 2014})
		expect(actual.schedules[sched.id].year).to.equal(2014)
	})

	it('moves just a semester', () => {
		let sched = Schedule({semester: 1})
		let stu = {schedules: {[sched.id]: sched}}
		let actual = moveScheduleInStudent(stu, sched.id, {semester: 3})
		expect(actual.schedules[sched.id].semester).to.equal(3)
	})

	it('moves both a year and a semester', () => {
		let sched = Schedule({year: 2012, semester: 1})
		let stu = {schedules: {[sched.id]: sched}}
		let actual = moveScheduleInStudent(stu, sched.id, {year: 2014, semester: 3})
		expect(actual.schedules[sched.id].year).to.equal(2014)
		expect(actual.schedules[sched.id].semester).to.equal(3)
	})

	it('throws if year is not a number', () => {
		let sched = Schedule()
		let stu = {schedules: {[sched.id]: sched}}
		expect(() => moveScheduleInStudent(stu, sched.id, {year: '2014'}))
			.to.throw(TypeError)
	})

	it('throws if semester is not a number', () => {
		let sched = Schedule()
		let stu = {schedules: {[sched.id]: sched}}
		expect(() => moveScheduleInStudent(stu, sched.id, {semester: '5'}))
			.to.throw(TypeError)
	})

	it('returns a new object', () => {
		let sched = Schedule({year: 2012})
		let actual = moveScheduleInStudent({schedules: {[sched.id]: sched}}, sched.id, {year: 2014})
		expect(actual.schedules[sched.id]).to.not.equal(sched)
	})

	it('throws if the schedule id cannot be found', () => {
		let sched = Schedule()
		let stu = {schedules: {}}
		expect(() => moveScheduleInStudent(stu, sched.id, {year: 2000}))
			.to.throw(ReferenceError)
	})
})

describe('reorderScheduleInStudent', () => {
	it('changes the "index" property', () => {
		let sched = Schedule({index: 0})
		let stu = {schedules: {[sched.id]: sched}}
		let newOrder = reorderScheduleInStudent(stu, sched.id, 5)
		expect(newOrder.schedules[sched.id].index).to.equal(5)
	})

	it('returns a new object', () => {
		let sched = Schedule({index: 0})
		let stu = {schedules: {[sched.id]: sched}}
		let newOrder = reorderScheduleInStudent(stu, sched.id, 5)
		expect(newOrder).to.not.equal(stu)
		expect(newOrder.schedules[sched.id]).to.not.equal(sched)
	})

	it('throws if the schedule id cannot be found', () => {
		let sched = Schedule()
		let stu = {schedules: {}}
		expect(() => reorderScheduleInStudent(stu, sched.id, 3))
			.to.throw(ReferenceError)
	})
})

describe('renameScheduleInStudent', () => {
	it('renames the schedule', () => {
		let sched = Schedule({title: 'Initial Title'})
		let stu = {schedules: {[sched.id]: sched}}
		let newOrder = renameScheduleInStudent(stu, sched.id, 'My New Title')
		expect(newOrder.schedules[sched.id].title).to.equal('My New Title')
	})

	it('returns a new object', () => {
		let sched = Schedule({title: 'Initial Title'})
		let stu = {schedules: {[sched.id]: sched}}
		let newOrder = renameScheduleInStudent(stu, sched.id, 'My New Title')
		expect(newOrder).to.not.equal(stu)
		expect(newOrder.schedules[sched.id]).to.not.equal(sched)
	})

	it('throws if the schedule id cannot be found', () => {
		let sched = Schedule()
		let stu = {schedules: {}}
		expect(() => renameScheduleInStudent(stu, sched.id, 'third'))
			.to.throw(ReferenceError)
	})
})

describe('addCourseToSchedule', () => {
	it('adds a course', () => {
		const sched = Schedule()
		const stu = addScheduleToStudent(Student(), sched)
		let addedCourse = addCourseToSchedule(stu, sched.id, 918)
		expect(addedCourse.schedules[sched.id].clbids).to.contain(918)
	})

	it('refuses to add non-number clbids', () => {
		const sched = Schedule()
		const stu = addScheduleToStudent(Student(), sched)
		expect(() => addCourseToSchedule(stu, sched.id, '918'))
			.to.throw(TypeError)
	})

	it('returns a new object', () => {
		const sched = Schedule()
		const stu = addScheduleToStudent(Student(), sched)
		let actual = addCourseToSchedule(stu, sched.id, 918)
		expect(actual).to.not.equal(stu)
		expect(actual.schedules[sched.id]).to.not.equal(stu.schedules[sched.id])
		expect(actual.schedules[sched.id]).to.not.equal(sched)
	})

	it('returns the same student if the clbid already exists in the schedule', () => {
		const sched = Schedule({clbids: [456]})
		const stu = addScheduleToStudent(Student(), sched)
		expect(addCourseToSchedule(stu, sched.id, 456)).to.equal(stu)
	})

	it('throws an error if the schedule cannot be found', () => {
		let sched = Schedule({clbids: [456]})
		let stu = addScheduleToStudent(Student(), sched)
		expect(() => addCourseToSchedule(stu, sched.id + 'bad', 456))
			.to.throw(ReferenceError)
	})
})

describe('removeCourseFromSchedule', () => {
	it('removes a course', () => {
		const sched = Schedule({clbids: [123]})
		const stu = addScheduleToStudent(Student(), sched)
		let removedCourse = removeCourseFromSchedule(stu, sched.id, 123)
		expect(removedCourse.schedules[sched.id].clbids).not.to.contain(123)
	})

	it('refuses to remove non-number clbids', () => {
		const sched = Schedule({clbids: [123]})
		const stu = addScheduleToStudent(Student(), sched)
		expect(() => removeCourseFromSchedule(stu, sched.id, '918'))
			.to.throw(TypeError)
	})

	it('returns a new object', () => {
		const sched = Schedule({clbids: [123]})
		const stu = addScheduleToStudent(Student(), sched)
		const actual = removeCourseFromSchedule(stu, sched.id, 123)
		expect(actual).to.not.equal(stu)
		expect(actual.schedules[sched.id]).to.not.equal(stu.schedules[sched.id])
		expect(actual.schedules[sched.id]).to.not.equal(sched)
	})

	it('returns the same student if the clbid does not exist in the schedule', () => {
		let sched = Schedule({clbids: []})
		let stu = addScheduleToStudent(Student(), sched)
		expect(removeCourseFromSchedule(stu, sched.id, 123)).to.equal(stu)
	})

	it('throws an error if the schedule cannot be found', () => {
		let sched = Schedule({clbids: [456]})
		let stu = addScheduleToStudent(Student(), sched)
		expect(() => removeCourseFromSchedule(stu, sched.id + 'bad', 456))
			.to.throw(ReferenceError)
	})
})

describe('reorderCourseInSchedule', () => {
	it('rearranges courses', () => {
		const sched = Schedule({clbids: [123, 456, 789]})
		const stu = addScheduleToStudent(Student(), sched)
		let rearranged = reorderCourseInSchedule(stu, sched.id, {clbid: 123, index: 1})
		expect(rearranged.schedules[sched.id].clbids).to.not.deep.equal([123, 456, 789])
		expect(rearranged.schedules[sched.id].clbids).to.deep.equal([456, 123, 789])
	})

	it('requires that the clbid be a number', () => {
		const sched = Schedule({clbids: [123, 456, 789]})
		const stu = addScheduleToStudent(Student(), sched)
		expect(() => reorderCourseInSchedule(stu, sched.id, {clbid: '123', index: 1})).to.throw(TypeError)
	})

	it('returns a new object', () => {
		const sched = Schedule({clbids: [123, 456, 789]})
		const stu = addScheduleToStudent(Student(), sched)
		let actual = reorderCourseInSchedule(stu, sched.id, {clbid: 123, index: 1})
		expect(actual).to.not.equal(stu)
		expect(actual.schedules[sched.id]).to.not.equal(stu.schedules[sched.id])
		expect(actual.schedules[sched.id]).to.not.equal(sched)
	})

	it('requires that the clbid to be moved actually appear in the list of clbids', () => {
		const sched = Schedule({clbids: [123, 456, 789]})
		const stu = addScheduleToStudent(Student(), sched)
		expect(() => reorderCourseInSchedule(stu, sched.id, {clbid: 123456789, index: 0}))
			.to.throw(ReferenceError)
	})

	it('throws if the schedule id cannot be found', () => {
		let sched = Schedule({clbids: [123456789, 123]})
		let stu = {schedules: {[sched.id]: sched}}
		expect(() => reorderCourseInSchedule(stu, sched.id + 'bad', {clbid: 123, index: 0}))
			.to.throw(ReferenceError)
	})

	it('truncates the requested index if it is greater than the number of courses', () => {
		let sched = Schedule({clbids: [123456789, 123]})
		let stu = {schedules: {[sched.id]: sched}}
		let reordered = reorderCourseInSchedule(stu, sched.id, {clbid: 123456789, index: 10})
		expect(findIndex(reordered.schedules[sched.id].clbids, c => c === 123456789)).to.equal(1)
	})

	it('truncates the requested index if it is Infinity', () => {
		let sched = Schedule({clbids: [123456789, 123]})
		let stu = {schedules: {[sched.id]: sched}}
		let reordered = reorderCourseInSchedule(stu, sched.id, {clbid: 123456789, index: Infinity})
		expect(findIndex(reordered.schedules[sched.id].clbids, c => c === 123456789)).to.equal(1)
	})

	it('truncates the requested index if it is less than 0', () => {
		let sched = Schedule({clbids: [123456789, 123]})
		let stu = {schedules: {[sched.id]: sched}}
		let reordered = reorderCourseInSchedule(stu, sched.id, {clbid: 123, index: -10})
		expect(findIndex(reordered.schedules[sched.id].clbids, c => c === 123)).to.equal(0)
	})
})
