import * as studentActions from '../students/constants'
import * as areaActions from '../areas/constants'
import * as courseActions from '../courses/constants'

import filter from 'lodash/collection/filter'
import includes from 'lodash/collection/includes'
import map from 'lodash/collection/map'

import {checkStudent} from '../processed/actions'

const whitelist = [
	studentActions.LOAD_STUDENTS,
	studentActions.INIT_STUDENT,
	studentActions.IMPORT_STUDENT,
	studentActions.CHANGE_CREDITS_NEEDED,
	studentActions.CHANGE_MATRICULATION,
	studentActions.CHANGE_GRADUATION,
	studentActions.ADD_AREA,
	studentActions.REMOVE_AREA,
	studentActions.REMOVE_AREAS,
	studentActions.ADD_SCHEDULE,
	studentActions.DESTROY_SCHEDULE,
	studentActions.DESTROY_SCHEDULES,
	studentActions.MOVE_SCHEDULE,
	studentActions.ADD_COURSE,
	studentActions.REMOVE_COURSE,
	studentActions.MOVE_COURSE,
	studentActions.SET_OVERRIDE,
	studentActions.REMOVE_OVERRIDE,
	studentActions.ADD_FABRICATION,
	studentActions.REMOVE_FABRICATION,

	// need to check everyone with one of the new areas
	// when one of these fires
	// areaActions.LOAD_AREAS,
	// areaActions.RELOAD_CACHED_AREAS,
	// areaActions.CACHE_AREAS_FROM_STUDIES,

	// need to check everyone with one of these courses
	// when one of these fires
	// courseActions.LOAD_COURSES,
	// courseActions.RELOAD_CACHED_COURSES,
	// courseActions.CACHE_COURSES_FROM_SCHEDULES,
]
function shouldTakeAction({type}) {
	console.log('shouldTakeAction', type, includes(whitelist, type))
	return includes(whitelist, type)
}

const checkStudentsMiddleware = store => next => action => {
	if (!shouldTakeAction(action)) {
		return next(action)
	}

	// save a copy of the old state
	const oldState = store.getState()
	const oldStudents = oldState.students.data

	// dispatch the action along the chain
	// this is what actually changes the state
	const result = next(action)

	// grab a copy of the *new* state
	const newState = store.getState()
	const newStudents = newState.students.data

	let affectedStudents = filter(newStudents, (_, id) => newStudents[id].present !== oldStudents[id].present)

	// check them
	const promises = map(affectedStudents, ({id}) => store.dispatch(checkStudent(id)))

	return Promise.all(promises).then(() => result)
}

// export default checkStudentsMiddleware

export default store => next => action => next(action)
