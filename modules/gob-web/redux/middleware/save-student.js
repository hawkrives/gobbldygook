import * as studentActions from '../students/constants'
import {ActionTypes as UndoableActionTypes} from 'redux-undo'
import {saveStudent} from '../../helpers/save-student'
import values from 'lodash/values'

const whitelist = new Set([
	studentActions.INIT_STUDENT,
	studentActions.IMPORT_STUDENT,
	studentActions.CHANGE_STUDENT,
	UndoableActionTypes.UNDO,
	UndoableActionTypes.REDO,
])

export const shouldTakeAction = ({type}) => {
	return whitelist.has(type)
}

const saveStudentsMiddleware = store => next => action => {
	if (!shouldTakeAction(action)) {
		return next(action)
	}

	console.log(action)

	// save a copy of the old state
	let oldState = store.getState()
	let oldStudents = oldState.students

	// dispatch the action along the chain
	// this is what actually changes the state
	let result = next(action)

	// grab a copy of the *new* state
	let newState = store.getState()
	let newStudents = newState.students

	if (oldStudents === newStudents) {
		return result
	}

	let studentIds = values(newStudents).map(s => s.present.id)

	// get any student whose identity has changed
	let toSave = studentIds.filter(id => {
		if (!oldStudents.hasOwnProperty(id)) {
			return true
		}
		return newStudents[id].present !== oldStudents[id].present
	})

	// save them
	let promises = toSave.map(id => {
		return saveStudent(newStudents[id].present)
	})

	return Promise.all(promises).then(() => result)
}

export default saveStudentsMiddleware
