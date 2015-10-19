import {Map} from 'immutable'
import {createAction} from 'redux-actions'
import undoable, {excludeAction} from 'redux-undo'
import uniqueId from 'lodash/utility/uniqueId'

import Student from '../models/student'
import demoStudent from '../models/demo-student.json'

// export const RELOAD = 'RELOAD'
export const REFRESH_DATA = 'REFRESH_DATA'
export const UNDO = 'UNDO'
export const REDO = 'REDO'
export const CREATE_STUDENT = 'CREATE_STUDENT'
export const IMPORT_STUDENT = 'IMPORT_STUDENT'
export const DESTROY_STUDENT = 'DESTROY_STUDENT'
export const CHANGE_NAME = 'CHANGE_NAME'
export const CHANGE_ADVISOR = 'CHANGE_ADVISOR'
export const CHANGE_CREDITS_NEEDED = 'CHANGE_CREDITS_NEEDED'
export const CHANGE_MATRICULATION = 'CHANGE_MATRICULATION'
export const CHANGE_GRADUATION = 'CHANGE_GRADUATION'
export const CHANGE_SETTING = 'CHANGE_SETTING'
export const ADD_AREA = 'ADD_AREA'
export const REMOVE_AREA = 'REMOVE_AREA'
export const REORDER_AREA = 'REORDER_AREA'
export const EDIT_AREA = 'EDIT_AREA'
export const ADD_SCHEDULE = 'ADD_SCHEDULE'
export const DESTROY_SCHEDULE = 'DESTROY_SCHEDULE'
export const RENAME_SCHEDULE = 'RENAME_SCHEDULE'
export const REORDER_SCHEDULE = 'REORDER_SCHEDULE'
export const MOVE_SCHEDULE = 'MOVE_SCHEDULE'
export const ADD_COURSE = 'ADD_COURSE'
export const REMOVE_COURSE = 'REMOVE_COURSE'
export const REORDER_COURSE = 'REORDER_COURSE'
export const MOVE_COURSE = 'MOVE_COURSE'
export const SET_OVERRIDE = 'SET_OVERRIDE'
export const REMOVE_OVERRIDE = 'REMOVE_OVERRIDE'
export const ADD_FABRICATION = 'ADD_FABRICATION'
export const REMOVE_FABRICATION = 'REMOVE_FABRICATION'
export const RESET_STUDENT_TO_DEMO = 'RESET_STUDENT_TO_DEMO'




export const refreshData = createAction(REFRESH_DATA)
export const undo = createAction(UNDO)
export const redo = createAction(REDO)

import forEach from 'lodash/collection/forEach'
import range from 'lodash/utility/range'

import stringify from 'json-stable-stringify'

// actions

export function saveStudent(student) {
	// grab the old (still-JSON-encoded) student from localstorage
	// compare it to the current one
	// if they're different, update dateLastModified, stringify, and save.
	const oldVersion = localStorage.getItem(student.id)

	if (oldVersion !== stringify(student)) {
		const student = student.set('dateLastModified', new Date())
		localStorage.setItem(student.id, stringify(student))
	}
}

import parseSIS from '../lib/parse-sis'
export function importStudentFromData({data, type}) {
	let stu = undefined
	if (type === 'application/json') {
		try {
			stu = JSON.parse(data)
		}
		catch (err) {
			return {type: CREATE_STUDENT, error: true, payload: err}
		}
	}

	else if (type === 'text/html') {
		const parser = new DOMParser()

		let html
		try {
			html = parser.parseFromString(data, 'text/html')
		}
		catch (err) {
			return {type: CREATE_STUDENT, error: true, payload: err}
		}

		try {
			stu = parseSIS(html)
		}
		catch (err) {
			return {type: CREATE_STUDENT, error: true, payload: err}
		}
	}

	if (!stu) {
		return {type: CREATE_STUDENT, error: true, payload: new Error('Could not extract a student')}
	}

	const fleshedStudent = new Student(stu)
	saveStudent(fleshedStudent)
	return {type: CREATE_STUDENT, payload: fleshedStudent}
}

export function createEmptyStudent() {
	const fleshedStudent = new Student().withMutations(student => {
		forEach(range(student.matriculation, student.graduation), year => {
			student = student.addSchedule({year, index: 1, active: true, semester: 1})
			student = student.addSchedule({year, index: 1, active: true, semester: 2})
			student = student.addSchedule({year, index: 1, active: true, semester: 3})
		})
	})
	saveStudent(fleshedStudent)
}

export function createStudent() {
	const student = createEmptyStudent()
	return {type: CREATE_STUDENT, payload: student}
}


// reducer

const initialState = Map({})

export function resetStudentToDemo(studentId) {
	const rawStudent = demoStudent
	rawStudent.id = studentId
	const student = new Student(rawStudent)
	return {type: RESET_STUDENT_TO_DEMO, payload: student}
}

export function reducer(state = initialState, action) {
	const {type, payload} = action

	if (type === RESET_STUDENT_TO_DEMO) {
		return state.set(payload.id, payload)
	}

	else if (type === CREATE_STUDENT) {
		return state.set(payload.id, payload)
	}

	return state
}

export default undoable(reducer, {
	limit: 15,
	undoType: UNDO,
	redoType: REDO,
	initialState: initialState,
	filter: excludeAction([]),
})
