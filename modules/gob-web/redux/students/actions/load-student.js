import {loadStudent as loadStudentFunc} from '../../../helpers/load-student'

import {LOAD_STUDENT} from '../constants'

function shouldLoad(state, id) {
	if (!(id in state.students)) {
		return true
	}

	let savedStudent = JSON.parse(localStorage.getItem(id))
	let thisStudent = state.students[id]

	let hasBeenModified =
		savedStudent.dateLastModified !== thisStudent.present.dateLastModified
	if (!hasBeenModified) {
		return false
	}

	return true
}

export function loadStudent(id) {
	return (dispatch, getState) => {
		if (!shouldLoad(getState(), id)) {
			return
		}

		return dispatch({type: LOAD_STUDENT, payload: loadStudentFunc(id)})
	}
}
