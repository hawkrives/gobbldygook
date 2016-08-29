// @flow
import Bluebird from 'bluebird'
import type {Middleware} from 'redux'
import * as studentActions from '../students/constants'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import map from 'lodash/map'
import {saveStudent} from '../students/actions/save-student'

const whitelist = [
	studentActions.INIT_STUDENT,
	studentActions.IMPORT_STUDENT,
	studentActions.CHANGE_NAME,
	studentActions.CHANGE_ADVISOR,
	studentActions.CHANGE_CREDITS_NEEDED,
	studentActions.CHANGE_MATRICULATION,
	studentActions.CHANGE_GRADUATION,
	studentActions.CHANGE_SETTING,
	studentActions.ADD_AREA,
	studentActions.REMOVE_AREA,
	studentActions.REMOVE_AREAS,
	studentActions.ADD_SCHEDULE,
	studentActions.DESTROY_SCHEDULE,
	studentActions.DESTROY_SCHEDULES,
	studentActions.RENAME_SCHEDULE,
	studentActions.REORDER_SCHEDULE,
	studentActions.MOVE_SCHEDULE,
	studentActions.ADD_COURSE,
	studentActions.REMOVE_COURSE,
	studentActions.REORDER_COURSE,
	studentActions.MOVE_COURSE,
	studentActions.SET_OVERRIDE,
	studentActions.REMOVE_OVERRIDE,
	studentActions.ADD_FABRICATION,
	studentActions.REMOVE_FABRICATION,
]
const shouldTakeAction = ({type}) => {
	return includes(whitelist, type)
}

const saveStudentsMiddleware: Middleware = store => next => action => {
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

	if (oldStudents === newStudents) {
		return result
	}

	// get any student objects whose identity has changed
	const studentsToSave = filter(newStudents, (_, id) => {
		if (!(id in oldStudents)) {
			return true
		}
		return newStudents[id].data.present !== oldStudents[id].data.present
	})

	// save them
	const promises = map(studentsToSave, stu =>
		store.dispatch(saveStudent(stu.data.present.id)))

	return Bluebird.all(promises).then(() => result)
}

export default saveStudentsMiddleware
