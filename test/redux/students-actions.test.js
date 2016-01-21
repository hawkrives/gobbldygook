import {expect} from 'chai'
import mock from 'mock-require'
import noop from 'lodash/noop'

mock('../../src/models/student', {
	__esModule: true,
	default: noop,
	saveStudent: noop,
	addScheduleToStudent: noop,
})
mock('../../src/models/schedule', () => ({}))

const {
	initStudent,
	importStudent,
	destroyStudent,
	changeName,
	changeAdvisor,
	changeCreditsNeeded,
	changeMatriculation,
	changeGraduation,
	changeSetting,
	addArea,
	removeArea,
	removeAreas,
	addSchedule,
	destroySchedule,
	destroySchedules,
	renameSchedule,
	reorderSchedule,
	moveSchedule,
	addCourse,
	removeCourse,
	reorderCourse,
	moveCourse,
	setOverride,
	removeOverride,
	addFabrication,
	removeFabrication,
} = require('../../src/ducks/actions/students')

const {
	INIT_STUDENT,
	IMPORT_STUDENT,
	DESTROY_STUDENT,
	CHANGE_NAME,
	CHANGE_ADVISOR,
	CHANGE_CREDITS_NEEDED,
	CHANGE_MATRICULATION,
	CHANGE_GRADUATION,
	CHANGE_SETTING,
	ADD_AREA,
	REMOVE_AREA,
	REMOVE_AREAS,
	ADD_SCHEDULE,
	DESTROY_SCHEDULE,
	DESTROY_SCHEDULES,
	RENAME_SCHEDULE,
	REORDER_SCHEDULE,
	MOVE_SCHEDULE,
	ADD_COURSE,
	REMOVE_COURSE,
	REORDER_COURSE,
	MOVE_COURSE,
	SET_OVERRIDE,
	REMOVE_OVERRIDE,
	ADD_FABRICATION,
	REMOVE_FABRICATION,
} = require('../../src/ducks/constants/students')

describe('initStudent action', () => {
	it('returns an action to create a student', () => {
		let action = initStudent()

		expect(action).to.have.property('type', INIT_STUDENT)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
	})
})

describe('importStudent action', () => {
	it('returns an action to import a student', () => {
		let action = importStudent({})

		expect(action).to.have.property('type', IMPORT_STUDENT)
		expect(action).to.have.property('payload')
	})

	it('includes an "error" property if there is an error', () => {
		let action = importStudent({data: '^INVALID_JSON^', type: 'application/json'})
		expect(action).to.have.property('error', true)
		expect(action).to.have.property('payload')
		expect(action.payload).to.have.property('message', 'Unexpected token ^')
	})
})

describe('destroyStudent action', () => {
	beforeEach(() => {
		localStorage.setItem('student', JSON.stringify({id: 'student'}))
		localStorage.setItem('studentIds', JSON.stringify(['student']))
	})
	afterEach(() => {
		localStorage.clear()
	})

	it('destroys a student and returns an action to remove it from memory', async () => {
		let actionPromise = destroyStudent('student')
		expect(actionPromise instanceof Promise).to.be.true

		let action = await actionPromise
		expect(action).to.have.property('type', DESTROY_STUDENT)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'student',
		})

		expect(localStorage.hasItem('student')).to.be.false
	})
})

describe('changeName action', () => {
	it('returns an action to change the name of a student', () => {
		let action = changeName('id', 'new name')
		expect(action).to.have.property('type', CHANGE_NAME)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			name: 'new name',
		})
	})
})

describe('changeAdvisor action', () => {
	it('returns an action to change the advisor of a student', () => {
		let action = changeAdvisor('id', 'new advisor')
		expect(action).to.have.property('type', CHANGE_ADVISOR)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			advisor: 'new advisor',
		})
	})
})

describe('changeCreditsNeeded action', () => {
	it('returns an action to change the creditsNeeded of a student', () => {
		let action = changeCreditsNeeded('id', 30)
		expect(action).to.have.property('type', CHANGE_CREDITS_NEEDED)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			credits: 30,
		})
	})
})

describe('changeMatriculation action', () => {
	it('returns an action to change the matriculation of a student', () => {
		let action = changeMatriculation('id', 1800)
		expect(action).to.have.property('type', CHANGE_MATRICULATION)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			matriculation: 1800,
		})
	})
})

describe('changeGraduation action', () => {
	it('returns an action to change the graduation of a student', () => {
		let action = changeGraduation('id', 2100)
		expect(action).to.have.property('type', CHANGE_GRADUATION)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			graduation: 2100,
		})
	})
})

describe('changeSetting action', () => {
	it('returns an action to change the setting of a student', () => {
		let action = changeSetting('id', 'key', 'val')
		expect(action).to.have.property('type', CHANGE_SETTING)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			key: 'key',
			value: 'val',
		})
	})
})


describe('addArea action', () => {
	it('returns an action to add an area to a student', () => {
		let action = addArea('id', {name: 'Area', type: 'Study?'})
		expect(action).to.have.property('type', ADD_AREA)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
	})
})

describe('removeArea action', () => {
	it('returns an action to remove an area from a student', () => {
		let action = removeArea('id', {name: 'Area', type: 'Study?'})
		expect(action).to.have.property('type', REMOVE_AREA)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			areaQuery: {name: 'Area', type: 'Study?'},
		})
	})
})

describe('removeAreas action', () => {
	it('returns an action to remove several areas from a student', () => {
		let action = removeAreas('id', {name: 'Area', type: 'Study?'})
		expect(action).to.have.property('type', REMOVE_AREAS)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			areaQueries: [{name: 'Area', type: 'Study?'}],
		})
	})
})


describe('addSchedule action', () => {
	it('returns an action to add a schedule to a student', () => {
		let action = addSchedule('id', {year: 2012})
		expect(action).to.have.property('type', ADD_SCHEDULE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
	})
})

describe('destroySchedule action', () => {
	it('returns an action to remove a schedule from a student', () => {
		let action = destroySchedule('id', 'sid')
		expect(action).to.have.property('type', DESTROY_SCHEDULE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			scheduleId: 'sid',
		})
	})
})

describe('destroySchedules action', () => {
	it('returns an action to remove several schedules from a student', () => {
		let action = destroySchedules('id', 'sid', 'sid2')
		expect(action).to.have.property('type', DESTROY_SCHEDULES)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			scheduleIds: ['sid', 'sid2'],
		})
	})
})

describe('renameSchedule action', () => {
	it('returns an action to rename a schedule', () => {
		let action = renameSchedule('id', 'sid', 'name')
		expect(action).to.have.property('type', RENAME_SCHEDULE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			scheduleId: 'sid',
			newTitle: 'name',
		})
	})
})

describe('reorderSchedule action', () => {
	it('returns an action to reorder a schedule', () => {
		let action = reorderSchedule('id', 'sid', 1)
		expect(action).to.have.property('type', REORDER_SCHEDULE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			scheduleId: 'sid',
			newIndex: 1,
		})
	})
})

describe('moveSchedule action', () => {
	it('returns an action to move a schedule', () => {
		let action = moveSchedule('id', 'sid', 2012, 3)
		expect(action).to.have.property('type', MOVE_SCHEDULE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			scheduleId: 'sid',
			year: 2012,
			semester: 3,
		})
	})
})


describe('addCourse action', () => {
	it('returns an action to add an override', () => {
		let action = addCourse('id', 'sid', 123)
		expect(action).to.have.property('type', ADD_COURSE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			scheduleId: 'sid',
			clbid: 123,
		})
	})
})

describe('removeCourse action', () => {
	it('returns an action to add an override', () => {
		let action = removeCourse('id', 'sid', 123)
		expect(action).to.have.property('type', REMOVE_COURSE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			scheduleId: 'sid',
			clbid: 123,
		})
	})
})

describe('reorderCourse action', () => {
	it('returns an action to add an override', () => {
		let action = reorderCourse('id', 'sid', 123, 2)
		expect(action).to.have.property('type', REORDER_COURSE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			scheduleId: 'sid',
			clbid: 123,
			index: 2,
		})
	})
})

describe('moveCourse action', () => {
	it('returns an action to add an override', () => {
		let action = moveCourse('id', 'fsid', 'tsid', 123)
		expect(action).to.have.property('type', MOVE_COURSE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			fromScheduleId: 'fsid',
			toScheduleId: 'tsid',
			clbid: 123,
		})
	})
})



describe('setOverride action', () => {
	it('returns an action to add an override', () => {
		let action = setOverride('id', 'override/path', true)
		expect(action).to.have.property('type', SET_OVERRIDE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			key: 'override/path',
			value: true,
		})
	})
})

describe('removeOverride action', () => {
	it('returns an action to remove an override', () => {
		let action = removeOverride('id', 'override/path')
		expect(action).to.have.property('type', REMOVE_OVERRIDE)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			override: 'override/path',
		})
	})
})


describe('addFabrication action', () => {
	it('returns an action to add a fabrication', () => {
		let action = addFabrication('id', {'fab/path': true})
		expect(action).to.have.property('type', ADD_FABRICATION)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			fabrication: {'fab/path': true},
		})
	})
})

describe('removeFabrication action', () => {
	it('returns an action to remove a fabrication', () => {
		let action = removeFabrication('id', 'fab/path')
		expect(action).to.have.property('type', REMOVE_FABRICATION)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			fabricationId: 'fab/path',
		})
	})
})

mock.stopAll()
