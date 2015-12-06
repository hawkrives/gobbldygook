import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import saveStudent from '../../models/save-student'
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


	const studentsToSave = filter(newStudents, (student, id) => newStudents[id] !== oldStudents[id])
	const studentSavingPromises = map(studentsToSave, student => {
		return new Promise((resolve, reject) => {
			saveStudent(student).then(resolve).catch(reject)
		})
	})

	return Promise.all(studentSavingPromises).then(result)
}

export default saveStudentsMiddleware
