import {expect} from 'chai'
import proxyquire from 'proxyquire'

const {
	INIT_STUDENT,                initStudent,
	IMPORT_STUDENT,              importStudent,
	DESTROY_STUDENT,             destroyStudent,
	CHANGE_NAME,                 changeName,
	CHANGE_ADVISOR,              changeAdvisor,
	CHANGE_CREDITS_NEEDED,       changeCreditsNeeded,
	CHANGE_MATRICULATION,        changeMatriculation,
	CHANGE_GRADUATION,           changeGraduation,
	CHANGE_SETTING,              changeSetting,
	ADD_AREA,                    addArea,
	REMOVE_AREA,                 removeArea,
	REMOVE_MULTIPLE_AREAS,       removeMultipleAreas,
	ADD_SCHEDULE,                addSchedule,
	DESTROY_SCHEDULE,            destroySchedule,
	DESTROY_MULTIPLE_SCHEDULES,  destroyMultipleSchedules,
	RENAME_SCHEDULE,             renameSchedule,
	REORDER_SCHEDULE,            reorderSchedule,
	MOVE_SCHEDULE,               moveSchedule,
	ADD_COURSE,                  addCourse,
	REMOVE_COURSE,               removeCourse,
	REORDER_COURSE,              reorderCourse,
	MOVE_COURSE,                 moveCourse,
	SET_OVERRIDE,                setOverride,
	REMOVE_OVERRIDE,             removeOverride,
	ADD_FABRICATION,             addFabrication,
	REMOVE_FABRICATION,          removeFabrication,
	} = proxyquire('../../src/ducks/students', {
		'../models/student': {
			'../helpers/localstorage': {setItem() {}, getItem() {}},
		},
	})


describe('initStudent', () => {
	it('should create an action', () => {
		expect(initStudent()).to.deep.equal({
			type: INIT_STUDENT,
		})
	})
})
describe('importStudent', () => {
	it('should create an action', () => {

	})
})
describe('destroyStudent', () => {
	it('should create an action', () => {

	})
})
describe('changeName', () => {
	it('should create an action', () => {

	})
})
describe('changeAdvisor', () => {
	it('should create an action', () => {

	})
})
describe('changeCreditsNeeded', () => {
	it('should create an action', () => {

	})
})
describe('changeMatriculation', () => {
	it('should create an action', () => {

	})
})
describe('changeGraduation', () => {
	it('should create an action', () => {

	})
})
describe('changeSetting', () => {
	it('should create an action', () => {

	})
})
describe('addArea', () => {
	it('should create an action', () => {

	})
})
describe('removeArea', () => {
	it('should create an action', () => {

	})
})
describe('removeMultipleAreas', () => {
	it('should create an action', () => {

	})
})
describe('addSchedule', () => {
	it('should create an action', () => {

	})
})
describe('destroySchedule', () => {
	it('should create an action', () => {

	})
})
describe('destroyMultipleSchedules', () => {
	it('should create an action', () => {

	})
})
describe('renameSchedule', () => {
	it('should create an action', () => {

	})
})
describe('reorderSchedule', () => {
	it('should create an action', () => {

	})
})
describe('moveSchedule', () => {
	it('should create an action', () => {

	})
})
describe('addCourse', () => {
	it('should create an action', () => {

	})
})
describe('removeCourse', () => {
	it('should create an action', () => {

	})
})
describe('reorderCourse', () => {
	it('should create an action', () => {

	})
})
describe('moveCourse', () => {
	it('should create an action', () => {

	})
})
describe('setOverride', () => {
	it('should create an action', () => {

	})
})
describe('removeOverride', () => {
	it('should create an action', () => {

	})
})
describe('addFabrication', () => {
	it('should create an action', () => {

	})
})
describe('removeFabrication', () => {
	it('should create an action', () => {

	})
})
