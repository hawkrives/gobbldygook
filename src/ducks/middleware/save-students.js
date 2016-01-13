import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import saveStudent from '../../helpers/save-student'
import * as studentActions from '../constants/students'
import includes from 'lodash/collection/includes'
import values from 'lodash/object/values'

const whitelist = [...values(studentActions)]
const blacklist = [studentActions.LOAD_STUDENTS]
export const shouldTakeAction = ({type}) => {
	return includes(whitelist, type) && !includes(blacklist, type)
}

const saveStudentsMiddleware = store => next => action => {
	if (!shouldTakeAction(action)) {
		return next(action)
	}

	// save a copy of the old state
	const oldState = store.getState()
	const oldStudents = oldState.students.present

	// dispatch the action along the chain
	// this is what actually changes the state
	const result = next(action)

	// grab a copy of the *new* state
	const newState = store.getState()
	const newStudents = newState.students.present

	// get any student objects whose identity has changed
	const studentsToSave = filter(newStudents, (_, id) => newStudents[id] !== oldStudents[id])

	// save them
	const studentSavingPromises = map(studentsToSave, saveStudent)

	return Promise.all(studentSavingPromises)
		.then(() => result)
}

export default saveStudentsMiddleware
