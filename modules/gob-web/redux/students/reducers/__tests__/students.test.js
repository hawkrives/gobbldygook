import size from 'lodash/size'
import range from 'lodash/range'

import {INIT_STUDENT, DESTROY_STUDENT} from '../../constants'
import {CHANGE_STUDENT} from '../../actions/change'

import {undoableReducer, reducer} from '../student'
import {ActionCreators} from 'redux-undo'
const {undo, redo} = ActionCreators

describe('students reducer', () => {
	it('handles INIT_STUDENT', () => {
		let initialState = {}

		let student = {id: 'xyz'}
		let action = {type: INIT_STUDENT, payload: student}

		let expected = student
		let actual = reducer(initialState, action)

		expect(actual).toEqual(expected)
		expect(actual).not.toBe(initialState)
	})

	it.skip('handles DESTROY_STUDENT', () => {
		// TODO: This needs to test the student-wrapper reducer
		let student = {id: 'xyz'}
		let initialState = student

		let action = {
			type: DESTROY_STUDENT,
			payload: {studentId: student.id},
		}

		let expected = {}
		let actual = reducer(initialState, action)

		expect(actual).toEqual(expected)
		expect(actual).not.toBe(initialState)
	})
})

describe('the undoable students reducer', () => {
	it('returns a new object with changes', () => {
		const initial = {}
		const hasOneStudent = undoableReducer(initial, {
			type: INIT_STUDENT,
			payload: {id: 'xyz'},
		})

		expect(hasOneStudent).toBeTruthy()
		expect(hasOneStudent.present).toBeTruthy()
		expect(size(hasOneStudent.present)).toBe(1)
	})

	it('treats INIT_STUDENT as a blank slate', () => {
		const initial = {}

		const firstStudent = {id: 'xyz'}
		const hasOneStudent = undoableReducer(initial, {
			type: INIT_STUDENT,
			payload: firstStudent,
		})

		// should have the initial state
		expect(hasOneStudent.past).toBeTruthy()
		expect(hasOneStudent.past.length).toBe(0)
		expect(hasOneStudent.present).toEqual(firstStudent)

		// should have the initial state and _no trace_ of the previous student
		const secondStudent = {id: 'abc'}
		const stillHasOneStudent = undoableReducer(hasOneStudent, {
			type: INIT_STUDENT,
			payload: secondStudent,
		})
		expect(hasOneStudent.past).toBeTruthy()
		expect(stillHasOneStudent.past.length).toBe(0)
		expect(stillHasOneStudent.present).toEqual(secondStudent)
	})

	it('holds previous states', () => {
		const initial = {}
		const student = {id: 'xyz'}
		const hasOneStudent = undoableReducer(initial, {
			type: INIT_STUDENT,
			payload: student,
		})

		// should have the initial state
		expect(hasOneStudent.past).toBeTruthy()
		expect(hasOneStudent.past.length).toBe(0)
		expect(hasOneStudent.present).toEqual(student)

		// should have the initial state *and* the single student state
		const hasTwoStudents = undoableReducer(hasOneStudent, {
			type: CHANGE_STUDENT,
			payload: {name: 'test'},
		})
		expect(hasTwoStudents.past.length).toBe(1)
		expect(hasTwoStudents.past[0]).toEqual(hasOneStudent.present)
	})

	it('allows undoing to a previous state', () => {
		const initial = {}
		const hasOneStudent = undoableReducer(initial, {
			type: INIT_STUDENT,
			payload: {id: 'xyz'},
		})
		const editedStudent = undoableReducer(hasOneStudent, {
			type: CHANGE_STUDENT,
			payload: {name: 'abc'},
		})

		const shouldBeInitial = undoableReducer(editedStudent, undo())
		expect(shouldBeInitial.present).toEqual(hasOneStudent.present)
	})

	it('allows redoing to a future state', () => {
		const initial = undoableReducer(
			{},
			{
				type: INIT_STUDENT,
				payload: {id: 'xyz'},
			},
		)
		const hasOneStudent = undoableReducer(initial, {
			type: CHANGE_STUDENT,
			payload: {name: 'abc', id: 'xyz'},
		})

		const shouldBeInitial = undoableReducer(hasOneStudent, undo())
		expect(shouldBeInitial.future).toBeTruthy()
		expect(shouldBeInitial.future.length).toBe(1)
		expect(shouldBeInitial.future[0]).toEqual(hasOneStudent.present)

		const shouldHaveOneStudent = undoableReducer(shouldBeInitial, redo())
		expect(shouldHaveOneStudent.future.length).toBe(0)
		expect(shouldHaveOneStudent.present).toEqual({
			id: 'xyz',
			name: 'abc',
		})
		expect(shouldHaveOneStudent.present).toEqual(hasOneStudent.present)

		expect(shouldHaveOneStudent.past.length).toBe(1)
		expect(shouldHaveOneStudent.past[0]).toEqual(initial.present)
	})

	it('only holds 9 previous states', () => {
		let state = {}
		for (let i of range(15)) {
			state = undoableReducer(state, {
				type: CHANGE_STUDENT,
				payload: {name: String(i)},
			})
		}

		expect(state.past.length).toBe(9)
	})
})
