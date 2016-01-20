import * as studentConstants from '../students/constants'
import * as areaConstants from '../areas/constants'
import * as courseConstants from '../courses/constants'

import filter from 'lodash/collection/filter'
import includes from 'lodash/collection/includes'
import map from 'lodash/collection/map'

import checkStudent from '../students/actions/check-student'

const whitelist = [
	studentConstants.LOAD_STUDENTS,
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

	// need to check everyone with one of the new areas
	// when one of these fires
	// areaConstants.LOAD_AREAS,
	// areaConstants.RELOAD_CACHED_AREAS,
	// areaConstants.CACHE_AREAS_FROM_STUDIES,

	// need to check everyone with one of these courses
	// when one of these fires
	// courseConstants.LOAD_COURSES,
	// courseConstants.RELOAD_CACHED_COURSES,
	// courseConstants.CACHE_COURSES_FROM_SCHEDULES,
]
function shouldTakeAction({type}) {
	return includes(whitelist, type)
}

const checkStudentsMiddleware = store => next => action => {
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

	const affectedStudents = filter(newStudents, (_, id) =>
		newStudents[id].data.present !== oldStudents[id].data.present)

	// check them
	const promises = map(affectedStudents, s =>
		store.dispatch(checkStudent(s.data.present.id)))

	return Promise.all(promises).then(() => result)
}

export default checkStudentsMiddleware

// export default store => next => action => next(action)
