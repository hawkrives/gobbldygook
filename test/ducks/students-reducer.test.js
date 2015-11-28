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
} from '../../src/ducks/constants/students'

describe('students reducer', () => {
	const {reducer} = require('../../src/ducks/reducers/students')

	it('should return the initial state', () => {
		const expected = {}
		const actual = reducer(undefined, {})
		expect(actual).to.deep.equal(expected)
	})
})

describe('students reducer', () => {
	const {reducer} = require('../../src/ducks/reducers/students')

	it('should handle INIT_STUDENT', () => {
		let initialState = {}

		let student = {id: 'xyz'}
		let action = {type: INIT_STUDENT, payload: student}

		let expected = {[student.id]: student}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from INIT_STUDENT')
	it('should return existing state if INIT_STUDENT has an error', () => {
		let initialState = {}

		let action = {type: INIT_STUDENT, payload: new Error(), error: true}

		let expected = initialState
		let actual = reducer(initialState, action)

		expect(actual).to.equal(expected)
	})

	it('should handle IMPORT_STUDENT', () => {
		let initialState = {}

		let student = {id: 'xyz'}
		let action = {type: IMPORT_STUDENT, payload: student}

		let expected = {[student.id]: student}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from IMPORT_STUDENT')
	it('should return existing state if IMPORT_STUDENT has an error')

	it('should handle DESTROY_STUDENT', () => {
		let student = {id: 'xyz'}
		let initialState = {[student.id]: student}

		let action = {type: DESTROY_STUDENT, payload: {studentId: student.id}}

		let expected = {}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from DESTROY_STUDENT')

	it('should handle CHANGE_NAME', () => {
		let student = {id: 'xyz', name: 'first'}
		let initialState = {[student.id]: student}

		let action = {type: CHANGE_NAME, payload: {
			studentId: student.id,
			name: 'second',
		}}

		let expected = {[student.id]: {...student, name: 'second'}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from CHANGE_NAME')

	it('should handle CHANGE_ADVISOR', () => {
		let student = {id: 'xyz', advisor: 'first'}
		let initialState = {[student.id]: student}

		let action = {type: CHANGE_ADVISOR, payload: {
			studentId: student.id,
			advisor: 'second',
		}}

		let expected = {[student.id]: {...student, advisor: 'second'}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from CHANGE_ADVISOR')

	it('should handle CHANGE_CREDITS_NEEDED', () => {
		let student = {id: 'xyz', creditsNeeded: 30}
		let initialState = {[student.id]: student}

		let action = {type: CHANGE_CREDITS_NEEDED, payload: {
			studentId: student.id,
			credits: 20,
		}}

		let expected = {[student.id]: {...student, creditsNeeded: 20}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from CHANGE_CREDITS_NEEDED')

	it('should handle CHANGE_MATRICULATION', () => {
		let student = {id: 'xyz', matriculation: 1800}
		let initialState = {[student.id]: student}

		let action = {type: CHANGE_MATRICULATION, payload: {
			studentId: student.id,
			matriculation: 2100,
		}}

		let expected = {[student.id]: {...student, matriculation: 2100}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from CHANGE_MATRICULATION')

	it('should handle CHANGE_GRADUATION', () => {
		let student = {id: 'xyz', graduation: 30}
		let initialState = {[student.id]: student}

		let action = {type: CHANGE_GRADUATION, payload: {
			studentId: student.id,
			graduation: 20,
		}}

		let expected = {[student.id]: {...student, graduation: 20}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from CHANGE_GRADUATION')

	it('should handle CHANGE_SETTING', () => {
		let student = {id: 'xyz', settings: {name: 'nothing'}}
		let initialState = {[student.id]: student}

		let action = {type: CHANGE_SETTING, payload: {
			studentId: student.id,
			key: 'key',
			value: 'value',
		}}

		let expected = {[student.id]: {...student, settings: {...student.settings, key: 'value'}}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from CHANGE_SETTING')

	it('should handle ADD_AREA', () => {
		let student = {id: 'xyz', studies: []}
		let initialState = {[student.id]: student}

		let action = {type: ADD_AREA, payload: {
			studentId: student.id,
			area: `I'm an area`,
		}}

		let expected = {[student.id]: {...student, studies: [`I'm an area`]}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from ADD_AREA')

	it('should handle REMOVE_AREA', () => {
		let student = {id: 'xyz', studies: [
			{name: 'Exercise Science', type: 'major'},
			{name: 'Asian Studies', type: 'major'},
		]}
		let initialState = {[student.id]: student}

		let action = {type: REMOVE_AREA, payload: {
			studentId: student.id,
			areaQuery: {name: 'Exercise Science', type: 'major'},
		}}

		let expected = {[student.id]: {...student, studies: [{name: 'Asian Studies', type: 'major'}]}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from REMOVE_AREA')

	it('should handle REMOVE_AREAS', () => {
		let student = {id: 'xyz', studies: [
			{name: 'Exercise Science', type: 'major'},
			{name: 'Computer Science', type: 'major'},
			{name: 'Asian Studies', type: 'major'},
		]}
		let initialState = {[student.id]: student}

		let action = {type: REMOVE_AREAS, payload: {
			studentId: student.id,
			areaQueries: [
				{name: 'Exercise Science', type: 'major'},
				{name: 'Computer Science', type: 'major'},
			],
		}}

		let expected = {[student.id]: {...student, studies: [{name: 'Asian Studies', type: 'major'}]}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from REMOVE_AREAS')

	it('should handle ADD_SCHEDULE', () => {
		let student = {id: 'xyz', schedules: {}}
		let initialState = {[student.id]: student}

		let action = {type: ADD_SCHEDULE, payload: {
			studentId: student.id,
			schedule: {id: 's', title: `I'm a schedule`},
		}}

		let expected = {[student.id]: {...student, schedules: {s: {id: 's', title: `I'm a schedule`}}}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from ADD_SCHEDULE')

	it('should handle DESTROY_SCHEDULE', () => {
		let student = {id: 'xyz', schedules: {
			'1': {id: '1', title: 'Schedule!!!'},
			'2': {id: '2', title: 'Schedule???'},
		}}
		let initialState = {[student.id]: student}

		let action = {type: DESTROY_SCHEDULE, payload: {
			studentId: student.id,
			scheduleId: '1',
		}}

		let expected = {
			[student.id]: {
				...student,
				schedules: {
					'2': {id: '2', title: 'Schedule???'},
				},
			},
		}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from DESTROY_SCHEDULE')

	it('should handle DESTROY_SCHEDULES', () => {
		let student = {id: 'xyz', schedules: {
			'1': {id: '1', title: 'Schedule!!!'},
			'2': {id: '2', title: 'Schedule???'},
			'3': {id: '3', title: 'Schedule!!!???'},
		}}
		let initialState = {[student.id]: student}

		let action = {type: DESTROY_SCHEDULES, payload: {
			studentId: student.id,
			scheduleIds: ['1', '3'],
		}}

		let expected = {
			[student.id]: {
				...student,
				schedules: {
					'2': {id: '2', title: 'Schedule???'},
				},
			},
		}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from DESTROY_SCHEDULES')

	it('should handle RENAME_SCHEDULE', () => {
		let student = {id: 'xyz', schedules: {
			'1': {id: '1', title: 'Schedule!!!'},
		}}
		let initialState = {[student.id]: student}

		let action = {type: RENAME_SCHEDULE, payload: {
			studentId: student.id,
			scheduleId: '1',
			newTitle: `I am too a schedule! How dare you!`,
		}}

		let expected = {
			[student.id]: {
				...student,
				schedules: {
					'1': {id: '1', title: `I am too a schedule! How dare you!`},
				},
			},
		}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from RENAME_SCHEDULE')

	it('should handle REORDER_SCHEDULE', () => {
		let student = {id: 'xyz', schedules: {
			'1': {id: '1', title: 'Schedule!!!', index: 1},
		}}
		let initialState = {[student.id]: student}

		let action = {type: REORDER_SCHEDULE, payload: {
			studentId: student.id,
			scheduleId: '1',
			newIndex: 5,
		}}

		let expected = {
			[student.id]: {
				...student,
				schedules: {
					'1': {id: '1', index: 5, title: 'Schedule!!!'},
				},
			},
		}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from REORDER_SCHEDULE')

	it('should handle MOVE_SCHEDULE', () => {
		let student = {id: 'xyz', schedules: {
			'1': {id: '1', year: 0, semester: 0},
		}}
		let initialState = {[student.id]: student}

		let action = {type: MOVE_SCHEDULE, payload: {
			studentId: student.id,
			scheduleId: '1',
			year: 2015,
			semester: 1,
		}}

		let expected = {
			[student.id]: {
				...student,
				schedules: {
					'1': {id: '1', year: 2015, semester: 1},
				},
			},
		}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from MOVE_SCHEDULE')

	it('should handle ADD_COURSE', () => {
		let student = {id: 'xyz', schedules: {
			'1': {id: '1', clbids: [123]},
		}}
		let initialState = {[student.id]: student}

		let action = {type: ADD_COURSE, payload: {
			studentId: student.id,
			scheduleId: '1',
			clbid: 789,
		}}

		let expected = {
			[student.id]: {
				...student,
				schedules: {'1': {id: '1', clbids: [123, 789]}},
			},
		}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from ADD_COURSE')

	it('should handle REMOVE_COURSE', () => {
		let student = {id: 'xyz', schedules: {
			'1': {id: '1', clbids: [123, 789]},
		}}
		let initialState = {[student.id]: student}

		let action = {type: REMOVE_COURSE, payload: {
			studentId: student.id,
			scheduleId: '1',
			clbid: 123,
		}}

		let expected = {
			[student.id]: {
				...student,
				schedules: {'1': {id: '1', clbids: [789]}},
			},
		}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from REMOVE_COURSE')

	it('should handle REORDER_COURSE', () => {
		let student = {id: 'xyz', schedules: {
			'1': {id: '1', clbids: [123, 789]},
		}}
		let initialState = {[student.id]: student}

		let action = {type: REORDER_COURSE, payload: {
			studentId: student.id,
			scheduleId: '1',
			clbid: 789,
			index: 0,
		}}

		let expected = {
			[student.id]: {
				...student,
				schedules: {'1': {id: '1', clbids: [789, 123]}},
			},
		}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from REORDER_COURSE')

	it('should handle MOVE_COURSE', () => {
		let student = {id: 'xyz', schedules: {
			'1': {id: '1', clbids: [123]},
			'2': {id: '2', clbids: [789]},
		}}
		let initialState = {[student.id]: student}

		let action = {type: MOVE_COURSE, payload: {
			studentId: student.id,
			scheduleId: '1',
			clbid: 123,
			fromScheduleId: '1',
			toScheduleId: '2',
		}}

		let expected = {
			[student.id]: {
				...student,
				schedules: {
					'1': {id: '1', clbids: []},
					'2': {id: '2', clbids: [789, 123]},
				},
			},
		}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from MOVE_COURSE')

	it('should handle SET_OVERRIDE', () => {
		let student = {id: 'xyz', overrides: {}}
		let initialState = {[student.id]: student}

		let action = {type: SET_OVERRIDE, payload: {
			studentId: student.id,
			key: 'path.to.override',
			value: 'strings!',
		}}

		let expected = {[student.id]: {...student, overrides: {'path.to.override': 'strings!'}}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from SET_OVERRIDE')

	it('should handle REMOVE_OVERRIDE', () => {
		let student = {id: 'xyz', overrides: {'path.to.override': true}}
		let initialState = {[student.id]: student}

		let action = {type: REMOVE_OVERRIDE, payload: {
			studentId: student.id,
			override: 'path.to.override',
		}}

		let expected = {[student.id]: {...student, overrides: {}}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from REMOVE_OVERRIDE')

	it('should handle ADD_FABRICATION', () => {
		let student = {id: 'xyz', fabrications: {}}
		let initialState = {[student.id]: student}

		let action = {type: ADD_FABRICATION, payload: {
			studentId: student.id,
			fabrication: {clbid: '1', something: 'um…'},
		}}

		let expected = {[student.id]: {...student, fabrications: {'1': {clbid: '1', something: 'um…'}}}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from ADD_FABRICATION')

	it('should handle REMOVE_FABRICATION', () => {
		let student = {id: 'xyz', fabrications: {'1': {clbid: '1', something: 'um…'}}}
		let initialState = {[student.id]: student}

		let action = {type: REMOVE_FABRICATION, payload: {
			studentId: student.id,
			fabricationId: '1',
		}}

		let expected = {[student.id]: {...student, fabrications: {}}}
		let actual = reducer(initialState, action)

		expect(actual).to.deep.equal(expected)
	})
	it('should return a new student and state from REMOVE_FABRICATION')
})


describe('the undoable students reducer', () => {
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
