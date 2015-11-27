import {expect} from 'chai'
import mock from 'mock-require'
import demoStudent from '../../src/models/demo-student.json'
import size from 'lodash/collection/size'
import filter from 'lodash/collection/filter'
import pluck from 'lodash/collection/pluck'
import find from 'lodash/collection/find'
import stringify from 'json-stable-stringify'

mock('../../src/helpers/get-courses', require('../mocks/get-courses.mock'))
mock('../../src/models/load-area', require('../mocks/load-area.mock'))
mock('../lib/check-student-graduatability', require('../mocks/check-student-graduatability.mock'))

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
	encodeStudent,
	saveStudent,
	validateSchedule,
} = require('../../src/models/student')

const getStudentCourses = require('../../src/helpers/get-student-courses')

const Study = require('../../src/models/study')
const Schedule = require('../../src/models/schedule')

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

	it('can turn into JSON', () => {
		const stu = Student()
		let result = stringify(stu)
		expect(result).to.be.ok
	})
})

describe('addFabricationToStudent', () => {
	it('supports adding fabrications', () => {
		const stu = Student()
		let addedFabrication = addFabricationToStudent(stu, {id: 'a'})
		expect(addedFabrication.fabrications['a']).to.deep.equal({id: 'a'})
	})
})

describe('removeFabricationFromStudent', () => {
	it('supports removing fabrications', () => {
		const stu = Student(demoStudent)
		let addedFabrication = addFabricationToStudent(stu, {id: 'a'})
		let noMoreFabrication = removeFabricationFromStudent(addedFabrication, 'a')
		expect(noMoreFabrication.fabrications.hasOwnProperty('a')).to.be.false
	})
})

describe('setOverrideOnStudent', () => {
	it('supports adding overrides', () => {
		const stu = Student()
		let addedOverride = setOverrideOnStudent(stu, 'nothing', 'me!')
		expect(addedOverride.overrides['nothing']).to.equal('me!')
	})
})

describe('removeOverrideFromStudent', () => {
	it('supports removing overrides', () => {
		const stu = Student(demoStudent)
		let removedOverride = removeOverrideFromStudent(stu, 'credits.taken')
		expect(removedOverride.overrides['credits.taken']).to.not.exist
	})
})

describe('addAreaToStudent', () => {
	it('supports adding areas', () => {
		const stu = Student()
		let query = {name: 'Exercise Science', type: 'major', revision: '2014-15'}
		let newArea = addAreaToStudent(stu, Study(query))
		expect(find(newArea.studies, query)).not.to.be.undefined
	})
})

describe('removeAreaFromStudent', () => {
	it('supports removing areas', () => {
		const stu = Student(demoStudent)
		let query = {type: 'major', name: 'Computer Science', revision: 'latest'}
		let noCsci = removeAreaFromStudent(stu, query)
		expect(find(noCsci.studies, query)).to.be.undefined
	})
})

describe('moveCourseToSchedule', () => {
	it('supports moving courses between schedules in one-ish operation', () => {
		const stu = Student(demoStudent)
		let movedCourse = moveCourseToSchedule(stu, '1', '2', 82908)
		expect(movedCourse.schedules['1'].clbids).to.not.include(82908)
		expect(movedCourse.schedules['2'].clbids).to.include(82908)
	})
})

describe('getStudentCourses', () => {
	it('only returns courses from active schedules', () => {
		const stu = Student(demoStudent)
		let courseCountFromActive = size(pluck(filter(demoStudent.schedules, 'active'), 'clbids'))
		getStudentCourses(stu).then(courses => expect(courses.length).to.equal(courseCountFromActive))
	})
})

describe('addScheduleToStudent', () => {
	it('supports adding schedules', () => {
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
})

describe('destroyScheduleFromStudent', () => {
	it('supports removing schedules', () => {
		const sched = Schedule
		const stu = addScheduleToStudent(Student(), sched)
		let removedSchedule = destroyScheduleFromStudent(stu, sched.id)
		expect(removedSchedule.schedules[sched.id]).to.be.undefined
	})
})


describe('changeStudentName', () => {
	it(`can change the student's name`, () => {
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
	it(`can change the student's advisor`, () => {
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
	it(`can change the student's number of credits needed`, () => {
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
	it(`can change the student's matriculation year`, () => {
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
	it(`can change the student's graduation year`, () => {
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
	it(`can change settings in the student `, () => {
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

	it('can move just a year', () => {
		let sched = Schedule({year: 2012})
		let stu = {schedules: {[sched.id]: sched}}
		let actual = moveScheduleInStudent(stu, sched.id, {year: 2014})
		expect(actual.schedules[sched.id].year).to.equal(2014)
	})

	it('can move just a semester', () => {
		let sched = Schedule({semester: 1})
		let stu = {schedules: {[sched.id]: sched}}
		let actual = moveScheduleInStudent(stu, sched.id, {semester: 3})
		expect(actual.schedules[sched.id].semester).to.equal(3)
	})

	it('can move both a year and a semester', () => {
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
})

// describe('reorderScheduleInStudent', () => {
// 	it('changes the "index" property', () => {
// 		let newOrder = reorderScheduleInStudent(sched, 5)
// 		expect(newOrder.index).to.equal(5)
// 	})
// 	it('returns a new object', () => {})
// })

// describe('renameScheduleInStudent', () => {
// 	it('renames the schedule', () => {
// 		let newName = renameScheduleInStudent(sched, 'My New Title')
// 		expect(newName.title).to.equal('My New Title')
// 	})
// 	it('returns a new object', () => {})
// })

describe('addCourseToSchedule', () => {
	let sched, stu
	beforeEach(() => {
		sched = Schedule()
		stu = addScheduleToStudent(Student(), sched)
	})

	it('supports adding a course', () => {
		let addedCourse = addCourseToSchedule(stu, sched.id, 918)
		expect(addedCourse.schedules[sched.id].clbids).to.contain(918)
	})

	it('refuses to add non-number clbids', () => {
		expect(() => addCourseToSchedule(stu, sched.id, '918')).to.throw(TypeError)
	})

	it('returns a new object', () => {
		let actual = addCourseToSchedule(stu, sched.id, 918)
		expect(actual).to.not.equal(stu)
		expect(actual.schedules[sched.id]).to.not.equal(stu.schedules[sched.id])
		expect(actual.schedules[sched.id]).to.not.equal(sched)
	})

	it('returns the same student if the clbid already exists in the schedule', () => {
		let sched = Schedule({clbids: [456]})
		let stu = addScheduleToStudent(Student(), sched)
		expect(addCourseToSchedule(stu, sched.id, 456)).to.equal(stu)
	})
})

// describe('removeCourseFromSchedule', () => {
// 	it('supports removing a course', () => {
// 		let removedCourse = removeCourseFromSchedule(sched, 123)
// 		expect(removedCourse.clbids).not.to.contain(123)
// 	})

// 	it('refuses to remove non-number clbids', () => {
// 		expect(() => removeCourseFromSchedule(sched, '918')).to.throw(TypeError)
// 	})

// 	it('returns a new object', () => {})
// 	it('returns the same student if the clbid does not exist in the schedule', () => {})
// })

// describe('reorderCourseInSchedule', () => {
// 	it('supports rearranging courses', () => {
// 		let rearranged = reorderCourseInSchedule(sched, 123, 2)
// 		expect(rearranged.clbids).to.not.deep.equal([123, 234, 345])
// 		expect(rearranged.clbids).to.deep.equal([234, 345, 123])
// 	})

// 	it('requires that the clbid be a number when rearranging', () => {
// 		expect(() => reorderCourseInSchedule(sched, '918', 1)).to.throw(TypeError)
// 	})

// 	it('returns a new object', () => {})
// })
