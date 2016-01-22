import loadStudentFunc from '../../../helpers/load-student'
import { checkStudent } from './check-student'

import {
	LOAD_STUDENT,
	BEGIN_LOAD_STUDENT,
} from '../constants'


function beginLoading(id) {
	return { type: BEGIN_LOAD_STUDENT, payload: {id} }
}

function actuallyLoadStudent(id) {
	return { type: LOAD_STUDENT, payload: loadStudentFunc(id) }
}

function shouldLoad(state, id) {
	if (!(id in state.students)) {
		return true
	}

	let savedStudent = JSON.parse(localStorage.getItem(id))
	let thisStudent = state.students[id]

	if (thisStudent.isLoading || savedStudent.dateLastModified === thisStudent.data.present.dateLastModified) {
		return false
	}

	return true
}

export function loadStudent(id) {
	return (dispatch, getState) => {
		if (!shouldLoad(getState(), id)) {
			return
		}

		dispatch(beginLoading(id))

		return dispatch(actuallyLoadStudent(id))
			.then(() => dispatch(checkStudent(id)))
	}
}
