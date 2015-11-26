import {expect} from 'chai'
import mock from 'mock-require'
import demoStudent from '../../src/models/demo-student.json'
import size from 'lodash/collection/size'
import filter from 'lodash/collection/filter'
import pluck from 'lodash/collection/pluck'
import find from 'lodash/collection/find'
import map from 'lodash/collection/map'
import stringify from 'json-stable-stringify'

mock('../../src/helpers/get-courses', (clbids, {year, semester}={}) => {
	return Promise.resolve(map(clbids, id => ({clbid: id, year, semester})))
})
mock('../lib/check-student-graduatability', () => Promise.resolve([]))

describe('Student', () => {
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
		encodeStudent,
		saveStudent,
		moveScheduleInStudent,
		reorderScheduleInStudent,
		renameScheduleInStudent,
		reorderCourseInSchedule,
		validateSchedule,
	} = require('../../src/models/student')

	const getStudentCourses = require('../../src/helpers/get-student-courses')

	it('creates a unique ID for each new student without an ID prop', () => {
		let stu1 = new Student()
		let stu2 = new Student()
		expect(stu1.id).to.not.equal(stu2.id)
	})

	it('holds a student', () => {
		const stu = new Student(demoStudent)
		const json = JSON.parse(JSON.stringify(stu))

		expect(stu).to.exist
		expect(stu.id).to.exist
		expect(stu.matriculation).to.equal(2012)
		expect(stu.graduation).to.equal(2016)
		expect(stu.creditsNeeded).to.equal(35)
		expect(json.studies).to.deep.equal(demoStudent.studies)
		expect(json.schedules).to.deep.equal(demoStudent.schedules)
		expect(json.fabrications).to.deep.equal(demoStudent.fabrications)
		expect(json.settings).to.deep.equal(demoStudent.settings)
		expect(json.overrides).to.deep.equal(demoStudent.overrides)
	})

	it('can turn into JSON', () => {
		const stu = new Student(demoStudent)
		let result = stringify(stu)
		expect(result).to.be.ok
	})

	// fabrications
	it('supports adding fabrications', () => {
		const stu = new Student(demoStudent)
		let addedFabrication = addFabricationToStudent(stu, {id: 'a'})
		expect(addedFabrication.fabrications['a']).to.deep.equal({id: 'a'})
	})
	it('supports removing fabrications', () => {
		const stu = new Student(demoStudent)
		let addedFabrication = addFabricationToStudent(stu, {id: 'a'})
		let noMoreFabrication = removeFabricationFromStudent(addedFabrication, 'a')
		expect(noMoreFabrication.fabrications.hasOwnProperty('a')).to.be.false
	})

	// overrides
	it('supports adding overrides', () => {
		const stu = new Student(demoStudent)
		let addedOverride = setOverrideOnStudent(stu, 'nothing', 'me!')
		expect(addedOverride.overrides['nothing']).to.equal('me!')
	})
	it('supports removing overrides', () => {
		const stu = new Student(demoStudent)
		let removedOverride = removeOverrideFromStudent(stu, 'credits.taken')
		expect(removedOverride.overrides['credits.taken']).to.not.exist
	})

	// areas
	it('supports adding areas', () => {
		const stu = new Student(demoStudent)
		let newArea = addAreaToStudent(stu, {name: 'Exercise Science', type: 'major', revision: '2014-15', path: 'majors/exercise-science/2014-15'})
		expect(find(newArea.studies, {path: 'majors/exercise-science/2014-15'})).not.to.be.undefined
	})
	it('supports removing areas', () => {
		const stu = new Student(demoStudent)
		let noCsci = removeAreaFromStudent(stu, 'majors/computer-science/latest')
		expect(find(noCsci.studies, {path: 'majors/computer-science/latest'})).to.be.undefined
	})

	// Courses
	it('returns only courses from active schedules', () => {
		const stu = new Student(demoStudent)
		let courseCountFromActive = size(pluck(filter(demoStudent.schedules, 'active'), 'clbids'))
		getStudentCourses(stu).then(courses => expect(courses.length).to.equal(courseCountFromActive))
	})
	it('supports moving courses between schedules in one-ish operation', () => {
		const stu = new Student(demoStudent)
		let movedCourse = moveCourseToSchedule(stu, 1, 2, 82908)
		expect(movedCourse.schedules[1].clbids).to.not.include(82908)
		expect(movedCourse.schedules[2].clbids).to.include(82908)
	})

	// schedules
	it('supports adding schedules', () => {
		const stu = new Student(demoStudent)
		let newSchedule = addScheduleToStudent(stu, {id: 10912, title: 'a', active: false, clbids: [], index: 1, semester: 0, year: 0})
		expect(newSchedule.schedules[10912]).to.deep.equal({
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
		const stu = new Student(demoStudent)
		let removedSchedule = destroyScheduleFromStudent(stu, 1)
		expect(removedSchedule.schedules[1]).to.be.undefined
	})
})
