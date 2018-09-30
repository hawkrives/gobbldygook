// @flow
import * as studentConstants from '../students/constants'
import * as courseConstants from '../courses/constants'

import toArray from 'lodash/toArray'

import {checkStudent} from '../students/actions/check-student'

const whitelist = new Set([
	studentConstants.INIT_STUDENT,
	studentConstants.IMPORT_STUDENT,
	studentConstants.CHANGE_CREDITS_NEEDED,
	studentConstants.CHANGE_MATRICULATION,
	studentConstants.CHANGE_GRADUATION,
	studentConstants.ADD_AREA,
	studentConstants.REMOVE_AREA,
	studentConstants.REMOVE_AREAS,
	studentConstants.ADD_SCHEDULE,
	studentConstants.DESTROY_SCHEDULE,
	studentConstants.DESTROY_SCHEDULES,
	studentConstants.MOVE_SCHEDULE,
	studentConstants.ADD_COURSE,
	studentConstants.REMOVE_COURSE,
	studentConstants.MOVE_COURSE,
	studentConstants.SET_OVERRIDE,
	studentConstants.REMOVE_OVERRIDE,
	studentConstants.ADD_FABRICATION,
	studentConstants.REMOVE_FABRICATION,

	// need to check everyone with one of these courses
	// when one of these fires
	courseConstants.REFRESH_COURSES,
])

function shouldTakeAction({type}: {type?: string} = {}) {
	return whitelist.has(type)
}

const checkMiddleware = (store: any) => (next: any) => async (action: any) => {
	if (!shouldTakeAction(action)) {
		return next(action)
	}

	// save a copy of the old state
	const oldState = store.getState()
	const oldStudents = oldState.students

	// dispatch the action along the chain
	// this is what actually changes the state
	const result = next(action)

	// grab a copy of the *new* state
	const newState = store.getState()
	const newStudents = newState.students

	let affectedStudents = []

	if (action.type === courseConstants.REFRESH_COURSES) {
		affectedStudents = toArray(newStudents)
	} else {
		affectedStudents = toArray(newStudents).filter((_, id) => {
			if (!(id in oldStudents)) {
				return true
			}
			return newStudents[id].data.present !== oldStudents[id].data.present
		})
	}

	// check them
	const promises = affectedStudents.map(s =>
		store.dispatch(checkStudent(s.data.present.id)),
	)

	await Promise.all(promises)

	return result
}

export default checkMiddleware
