import {expect} from 'chai'
import size from 'lodash/collection/size'
import range from 'lodash/utility/range'

import {
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
	REMOVE_MULTIPLE_AREAS,
	ADD_SCHEDULE,
	DESTROY_SCHEDULE,
	DESTROY_MULTIPLE_SCHEDULES,
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
} from '../../src/ducks/constants/students'

describe('students reducer', () => {
	const {reducer} = require('../../src/ducks/reducers/students')

	it('should return the initial state', () => {
		const expected = {}
		const actual = reducer(undefined, {})
		expect(actual).to.deep.equal(expected)
	})
})

xdescribe('students reducer\'s response to actions', () => {
	const {reducer} = require('../../src/ducks/reducers/students')

	it('should handle INIT_STUDENT')
	it('should handle IMPORT_STUDENT')
	it('should handle DESTROY_STUDENT')
	it('should handle CHANGE_NAME')
	it('should handle CHANGE_ADVISOR')
	it('should handle CHANGE_CREDITS_NEEDED')
	it('should handle CHANGE_MATRICULATION')
	it('should handle CHANGE_GRADUATION')
	it('should handle CHANGE_SETTING')
	it('should handle ADD_AREA')
	it('should handle REMOVE_AREA')
	it('should handle REMOVE_MULTIPLE_AREAS')
	it('should handle ADD_SCHEDULE')
	it('should handle DESTROY_SCHEDULE')
	it('should handle DESTROY_MULTIPLE_SCHEDULES')
	it('should handle RENAME_SCHEDULE')
	it('should handle REORDER_SCHEDULE')
	it('should handle MOVE_SCHEDULE')
	it('should handle ADD_COURSE')
	it('should handle REMOVE_COURSE')
	it('should handle REORDER_COURSE')
	it('should handle MOVE_COURSE')
	it('should handle SET_OVERRIDE')
	it('should handle REMOVE_OVERRIDE')
	it('should handle ADD_FABRICATION')
	it('should handle REMOVE_FABRICATION')
})

describe.only('the undoable students reducer', () => {
	const {default: undoableReducer} = require('../../src/ducks/reducers/students')
	const {ActionCreators: {undo, redo}} = require('redux-undo')

	it('should return the initial state', () => {
		const expected = {
			past: [
				{},
			],
			present: {},
			future: [],
		}

		const actual = undoableReducer(undefined, {})
		expect(actual.past).to.deep.equal(expected.past)
		expect(actual.present).to.deep.equal(expected.present)
		expect(actual.future).to.deep.equal(expected.future)
	})

	it('should return a new object with changes', () => {
		const initial = {}
		const hasOneStudent = undoableReducer(initial, {type: INIT_STUDENT, payload: {id: 'xyz'}})

		expect(hasOneStudent).to.be.ok
		expect(hasOneStudent.present).to.be.ok
		expect(size(hasOneStudent.present)).to.equal(1)
	})

	it('should hold previous states', () => {
		const initial = {}
		const hasOneStudent = undoableReducer(initial, {type: INIT_STUDENT, payload: {id: 'xyz'}})

		// should have the initial state
		expect(hasOneStudent.past).to.be.ok
		expect(hasOneStudent.past.length).to.equal(1)
		expect(hasOneStudent.past[0]).to.deep.equal(initial)

		// should have the initial state *and* the single student state
		const hasTwoStudents = undoableReducer(hasOneStudent, {type: INIT_STUDENT, payload: {id: 'abc'}})
		expect(hasTwoStudents.past.length).to.equal(2)
		expect(hasTwoStudents.past[0]).to.deep.equal(initial)
		expect(hasTwoStudents.past[1]).to.deep.equal(hasOneStudent.present)
	})

	it('should allow undoing to a previous state', () => {
		const initial = {}
		const hasOneStudent = undoableReducer(initial, {type: INIT_STUDENT, payload: {id: 'xyz'}})

		const shouldBeInitial = undoableReducer(hasOneStudent, undo())
		expect(shouldBeInitial.present).to.deep.equal(initial)
	})

	it('should allow redoing to a future state', () => {
		const initial = {}
		const hasOneStudent = undoableReducer(initial, {type: INIT_STUDENT, payload: {id: 'xyz'}})

		const shouldBeInitial = undoableReducer(hasOneStudent, undo())
		expect(shouldBeInitial.future).to.be.ok
		expect(shouldBeInitial.future.length).to.equal(1)
		expect(shouldBeInitial.future[0]).to.deep.equal(hasOneStudent.present)

		const shouldHaveOneStudent = undoableReducer(shouldBeInitial, redo())
		expect(shouldHaveOneStudent.future.length).to.equal(0)
		expect(shouldHaveOneStudent.present).to.have.property('xyz').and.deep.equal({id: 'xyz'})
		expect(shouldHaveOneStudent.present).to.deep.equal(hasOneStudent.present)

		expect(shouldHaveOneStudent.past.length).to.equal(1)
		expect(shouldHaveOneStudent.past[0]).to.deep.equal(initial)
	})

	it('should only hold 9 previous states', () => {
		const initial = {}

		let state = initial
		for (let i of range(15)) {
			state = undoableReducer(state, {type: INIT_STUDENT, payload: {id: String(i)}})
		}

		expect(state.past.length).to.equal(9)
	})
})
