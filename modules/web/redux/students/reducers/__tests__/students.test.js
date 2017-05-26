import size from 'lodash/size'
import range from 'lodash/range'

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
} from '../../constants'

import {
    default as undoableReducer,
    studentReducer as reducer,
} from '../student'
import { ActionCreators } from 'redux-undo'
const { undo, redo } = ActionCreators

describe('students reducer', () => {
    it('returns the initial state', () => {
        const expected = {}
        const actual = reducer(undefined, {})
        expect(actual).toEqual(expected)
    })
})

describe('students reducer', () => {
    it('handles INIT_STUDENT', () => {
        let initialState = {}

        let student = { id: 'xyz' }
        let action = { type: INIT_STUDENT, payload: student }

        let expected = student
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
    })
    it('returns existing state if INIT_STUDENT has an error', () => {
        let initialState = {}

        let action = { type: INIT_STUDENT, payload: new Error(), error: true }

        let expected = initialState
        let actual = reducer(initialState, action)

        expect(actual).toBe(expected)
    })

    it('returns existing state if IMPORT_STUDENT has an error', () => {
        let initialState = {}

        let action = {
            type: IMPORT_STUDENT,
            payload: new Error(),
            error: true,
        }

        let expected = initialState
        let actual = reducer(initialState, action)

        expect(actual).toBe(expected)
    })

    it.skip('handles DESTROY_STUDENT', () => {
        // TODO: This needs to test the student-wrapper reducer
        let student = { id: 'xyz' }
        let initialState = student

        let action = {
            type: DESTROY_STUDENT,
            payload: { studentId: student.id },
        }

        let expected = {}
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
    })

    it('handles CHANGE_NAME', () => {
        let student = { id: 'xyz', name: 'first' }
        let initialState = student

        let action = {
            type: CHANGE_NAME,
            payload: {
                studentId: student.id,
                name: 'second',
            },
        }

        let expected = { ...student, name: 'second' }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual['xyz']).not.toBe(student)
    })

    it('handles CHANGE_ADVISOR', () => {
        let student = { id: 'xyz', advisor: 'first' }
        let initialState = student

        let action = {
            type: CHANGE_ADVISOR,
            payload: {
                studentId: student.id,
                advisor: 'second',
            },
        }

        let expected = { ...student, advisor: 'second' }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual['xyz']).not.toBe(student)
    })

    it('handles CHANGE_CREDITS_NEEDED', () => {
        let student = { id: 'xyz', creditsNeeded: 30 }
        let initialState = student

        let action = {
            type: CHANGE_CREDITS_NEEDED,
            payload: {
                studentId: student.id,
                credits: 20,
            },
        }

        let expected = { ...student, creditsNeeded: 20 }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual['xyz']).not.toBe(student)
    })

    it('handles CHANGE_MATRICULATION', () => {
        let student = { id: 'xyz', matriculation: 1800 }
        let initialState = student

        let action = {
            type: CHANGE_MATRICULATION,
            payload: {
                studentId: student.id,
                matriculation: 2100,
            },
        }

        let expected = { ...student, matriculation: 2100 }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual['xyz']).not.toBe(student)
    })

    it('handles CHANGE_GRADUATION', () => {
        let student = { id: 'xyz', graduation: 30 }
        let initialState = student

        let action = {
            type: CHANGE_GRADUATION,
            payload: {
                studentId: student.id,
                graduation: 20,
            },
        }

        let expected = { ...student, graduation: 20 }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual['xyz']).not.toBe(student)
    })

    it('handles CHANGE_SETTING', () => {
        let student = { id: 'xyz', settings: { name: 'nothing' } }
        let initialState = student

        let action = {
            type: CHANGE_SETTING,
            payload: {
                studentId: student.id,
                key: 'key',
                value: 'value',
            },
        }

        let expected = {
            ...student,
            settings: { ...student.settings, key: 'value' },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual['xyz']).not.toBe(student)
    })

    it('handles ADD_AREA', () => {
        let student = { id: 'xyz', studies: [] }
        let initialState = student

        let area = { name: `I'm an area` }
        let action = {
            type: ADD_AREA,
            payload: {
                studentId: student.id,
                area: area,
            },
        }

        let expected = { ...student, studies: [{ name: `I'm an area` }] }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual['xyz']).not.toBe(student)
    })

    it('handles REMOVE_AREA', () => {
        let student = {
            id: 'xyz',
            studies: [
                { name: 'Exercise Science', type: 'major' },
                { name: 'Asian Studies', type: 'major' },
            ],
        }
        let initialState = student

        let action = {
            type: REMOVE_AREA,
            payload: {
                studentId: student.id,
                areaQuery: { name: 'Exercise Science', type: 'major' },
            },
        }

        let expected = {
            ...student,
            studies: [{ name: 'Asian Studies', type: 'major' }],
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual['xyz']).not.toBe(student)
    })

    it('handles REMOVE_AREAS', () => {
        let student = {
            id: 'xyz',
            studies: [
                { name: 'Exercise Science', type: 'major' },
                { name: 'Computer Science', type: 'major' },
                { name: 'Asian Studies', type: 'major' },
            ],
        }
        let initialState = student

        let action = {
            type: REMOVE_AREAS,
            payload: {
                studentId: student.id,
                areaQueries: [
                    { name: 'Exercise Science', type: 'major' },
                    { name: 'Computer Science', type: 'major' },
                ],
            },
        }

        let expected = {
            ...student,
            studies: [{ name: 'Asian Studies', type: 'major' }],
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual['xyz']).not.toBe(student)
    })

    it('handles ADD_SCHEDULE', () => {
        let student = { id: 'xyz', schedules: {} }
        let initialState = student

        let action = {
            type: ADD_SCHEDULE,
            payload: {
                studentId: student.id,
                schedule: { id: 's', title: `I'm a schedule` },
            },
        }

        let expected = {
            ...student,
            schedules: { s: { id: 's', title: `I'm a schedule` } },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.schedules).not.toBe(student.schedules)
    })

    it('handles DESTROY_SCHEDULE', () => {
        let student = {
            id: 'xyz',
            schedules: {
                '1': { id: '1', title: 'Schedule!!!' },
                '2': { id: '2', title: 'Schedule???' },
            },
        }
        let initialState = student

        let action = {
            type: DESTROY_SCHEDULE,
            payload: {
                studentId: student.id,
                scheduleId: '1',
            },
        }

        let expected = {
            ...student,
            schedules: { '2': { id: '2', title: 'Schedule???' } },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.schedules).not.toBe(student.schedules)
    })

    it('handles DESTROY_SCHEDULES', () => {
        let student = {
            id: 'xyz',
            schedules: {
                '1': { id: '1', title: 'Schedule!!!' },
                '2': { id: '2', title: 'Schedule???' },
                '3': { id: '3', title: 'Schedule!!!???' },
            },
        }
        let initialState = student

        let action = {
            type: DESTROY_SCHEDULES,
            payload: {
                studentId: student.id,
                scheduleIds: ['1', '3'],
            },
        }

        let expected = {
            ...student,
            schedules: { '2': { id: '2', title: 'Schedule???' } },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.schedules).not.toBe(student.schedules)
    })

    it('handles RENAME_SCHEDULE', () => {
        let student = {
            id: 'xyz',
            schedules: {
                '1': { id: '1', title: 'Schedule!!!' },
            },
        }
        let initialState = student

        let action = {
            type: RENAME_SCHEDULE,
            payload: {
                studentId: student.id,
                scheduleId: '1',
                newTitle: `I am too a schedule! How dare you!`,
            },
        }

        let expected = {
            ...student,
            schedules: {
                '1': { id: '1', title: `I am too a schedule! How dare you!` },
            },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.schedules).not.toBe(student.schedules)
        expect(actual.schedules['1']).not.toBe(student.schedules['1'])
    })

    it('handles REORDER_SCHEDULE', () => {
        let student = {
            id: 'xyz',
            schedules: {
                '1': { id: '1', title: 'Schedule!!!', index: 1 },
            },
        }
        let initialState = student

        let action = {
            type: REORDER_SCHEDULE,
            payload: {
                studentId: student.id,
                scheduleId: '1',
                newIndex: 5,
            },
        }

        let expected = {
            ...student,
            schedules: {
                '1': { id: '1', index: 5, title: 'Schedule!!!' },
            },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.schedules).not.toBe(student.schedules)
        expect(actual.schedules['1']).not.toBe(student.schedules['1'])
    })

    it('handles MOVE_SCHEDULE', () => {
        let student = {
            id: 'xyz',
            schedules: {
                '1': { id: '1', year: 0, semester: 0 },
            },
        }
        let initialState = student

        let action = {
            type: MOVE_SCHEDULE,
            payload: {
                studentId: student.id,
                scheduleId: '1',
                year: 2015,
                semester: 1,
            },
        }

        let expected = {
            ...student,
            schedules: {
                '1': { id: '1', year: 2015, semester: 1 },
            },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.schedules).not.toBe(student.schedules)
        expect(actual.schedules['1']).not.toBe(student.schedules['1'])
    })

    it('handles ADD_COURSE', () => {
        let student = {
            id: 'xyz',
            schedules: {
                '1': { id: '1', clbids: [123] },
            },
        }
        let initialState = student

        let action = {
            type: ADD_COURSE,
            payload: {
                studentId: student.id,
                scheduleId: '1',
                clbid: 789,
            },
        }

        let expected = {
            ...student,
            schedules: { '1': { id: '1', clbids: [123, 789] } },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.schedules).not.toBe(student.schedules)
        expect(actual.schedules['1']).not.toBe(student.schedules['1'])
        expect(actual.schedules['1'].clbids).not.toBe(
            student.schedules['1'].clbids
        )
    })

    it('handles REMOVE_COURSE', () => {
        let student = {
            id: 'xyz',
            schedules: {
                '1': { id: '1', clbids: [123, 789] },
            },
        }
        let initialState = student

        let action = {
            type: REMOVE_COURSE,
            payload: {
                studentId: student.id,
                scheduleId: '1',
                clbid: 123,
            },
        }

        let expected = {
            ...student,
            schedules: { '1': { id: '1', clbids: [789] } },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.schedules).not.toBe(student.schedules)
        expect(actual.schedules['1']).not.toBe(student.schedules['1'])
        expect(actual.schedules['1'].clbids).not.toBe(
            student.schedules['1'].clbids
        )
    })

    it('handles REORDER_COURSE', () => {
        let student = {
            id: 'xyz',
            schedules: {
                '1': { id: '1', clbids: [123, 789] },
            },
        }
        let initialState = student

        let action = {
            type: REORDER_COURSE,
            payload: {
                studentId: student.id,
                scheduleId: '1',
                clbid: 789,
                index: 0,
            },
        }

        let expected = {
            ...student,
            schedules: { '1': { id: '1', clbids: [789, 123] } },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.schedules).not.toBe(student.schedules)
        expect(actual.schedules['1']).not.toBe(student.schedules['1'])
        expect(actual.schedules['1'].clbids).not.toBe(
            student.schedules['1'].clbids
        )
    })

    it('handles MOVE_COURSE', () => {
        let student = {
            id: 'xyz',
            schedules: {
                '1': { id: '1', clbids: [123] },
                '2': { id: '2', clbids: [789] },
            },
        }
        let initialState = student

        let action = {
            type: MOVE_COURSE,
            payload: {
                studentId: student.id,
                scheduleId: '1',
                clbid: 123,
                fromScheduleId: '1',
                toScheduleId: '2',
            },
        }

        let expected = {
            ...student,
            schedules: {
                '1': { id: '1', clbids: [] },
                '2': { id: '2', clbids: [789, 123] },
            },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.schedules).not.toBe(student.schedules)
        expect(actual.schedules['1']).not.toBe(student.schedules['1'])
        expect(actual.schedules['1'].clbids).not.toBe(
            student.schedules['1'].clbids
        )
    })

    it('handles SET_OVERRIDE', () => {
        let student = { id: 'xyz', overrides: {} }
        let initialState = student

        let action = {
            type: SET_OVERRIDE,
            payload: {
                studentId: student.id,
                key: 'path.to.override',
                value: 'strings!',
            },
        }

        let expected = {
            ...student,
            overrides: { 'path.to.override': 'strings!' },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.overrides).not.toBe(student.overrides)
    })

    it('handles REMOVE_OVERRIDE', () => {
        let student = { id: 'xyz', overrides: { 'path.to.override': true } }
        let initialState = student

        let action = {
            type: REMOVE_OVERRIDE,
            payload: {
                studentId: student.id,
                override: 'path.to.override',
            },
        }

        let expected = { ...student, overrides: {} }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.overrides).not.toBe(student.overrides)
    })

    it('handles ADD_FABRICATION', () => {
        let student = { id: 'xyz', fabrications: {} }
        let initialState = student

        let action = {
            type: ADD_FABRICATION,
            payload: {
                studentId: student.id,
                fabrication: { clbid: '1', something: 'um…' },
            },
        }

        let expected = {
            ...student,
            fabrications: { '1': { clbid: '1', something: 'um…' } },
        }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.fabrications).not.toBe(student.fabrications)
    })

    it('handles REMOVE_FABRICATION', () => {
        let student = {
            id: 'xyz',
            fabrications: { '1': { clbid: '1', something: 'um…' } },
        }
        let initialState = student

        let action = {
            type: REMOVE_FABRICATION,
            payload: {
                studentId: student.id,
                fabricationId: '1',
            },
        }

        let expected = { ...student, fabrications: {} }
        let actual = reducer(initialState, action)

        expect(actual).toEqual(expected)
        expect(actual).not.toBe(initialState)
        expect(actual).not.toBe(student)
        expect(actual.fabrications).not.toBe(student.fabrications)
    })
})

describe('the undoable students reducer', () => {
    it('returns the initial state', () => {
        const expected = {
            past: [],
            present: {},
            future: [],
        }

        const actual = undoableReducer(undefined, {})
        expect(actual.past).toEqual(expected.past)
        expect(actual.present).toEqual(expected.present)
        expect(actual.future).toEqual(expected.future)
    })

    it('returns a new object with changes', () => {
        const initial = {}
        const hasOneStudent = undoableReducer(initial, {
            type: INIT_STUDENT,
            payload: { id: 'xyz' },
        })

        expect(hasOneStudent).toBeTruthy()
        expect(hasOneStudent.present).toBeTruthy()
        expect(size(hasOneStudent.present)).toBe(1)
    })

    it('treats INIT_STUDENT as a blank slate', () => {
        const initial = {}

        const firstStudent = { id: 'xyz' }
        const hasOneStudent = undoableReducer(initial, {
            type: INIT_STUDENT,
            payload: firstStudent,
        })

        // should have the initial state
        expect(hasOneStudent.past).toBeTruthy()
        expect(hasOneStudent.past.length).toBe(0)
        expect(hasOneStudent.present).toEqual(firstStudent)

        // should have the initial state and _no trace_ of the previous student
        const secondStudent = { id: 'abc' }
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
        const student = { id: 'xyz' }
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
            type: CHANGE_NAME,
            payload: { name: 'test' },
        })
        expect(hasTwoStudents.past.length).toBe(1)
        expect(hasTwoStudents.past[0]).toEqual(hasOneStudent.present)
    })

    it('allows undoing to a previous state', () => {
        const initial = {}
        const hasOneStudent = undoableReducer(initial, {
            type: INIT_STUDENT,
            payload: { id: 'xyz' },
        })
        const editedStudent = undoableReducer(hasOneStudent, {
            type: CHANGE_NAME,
            payload: { name: 'abc' },
        })

        const shouldBeInitial = undoableReducer(editedStudent, undo())
        expect(shouldBeInitial.present).toEqual(hasOneStudent.present)
    })

    it('allows redoing to a future state', () => {
        const initial = undoableReducer(initial, {
            type: INIT_STUDENT,
            payload: { id: 'xyz' },
        })
        const hasOneStudent = undoableReducer(initial, {
            type: CHANGE_NAME,
            payload: { name: 'abc' },
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
                type: CHANGE_NAME,
                payload: { name: String(i) },
            })
        }

        expect(state.past.length).toBe(9)
    })
})
