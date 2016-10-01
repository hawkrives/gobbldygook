import {expect} from 'chai'

import {
	addCourse,
	removeCourse,
	reorderCourse,
	moveCourse,
} from '../courses'

import {
	ADD_COURSE,
	REMOVE_COURSE,
	REORDER_COURSE,
	MOVE_COURSE,
} from '../../constants'

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
