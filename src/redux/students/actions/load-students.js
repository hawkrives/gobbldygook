import map from 'lodash/collection/map'
import uniq from 'lodash/array/uniq'

import loadStudentFunc from '../../../helpers/load-student'

import {
	LOAD_STUDENT,
	LOAD_STUDENTS,
	BEGIN_LOADING,
} from '../constants'

function beginLoading(ids) {
	return {type: BEGIN_LOADING, payload: ids}
}

function shouldLoad(state, id) {
	if (state.students.isLoading || id in state.students.data) {
		return false
	}
	return true
}


export function loadStudent(id) {
	return (dispatch, getState) => {
		if (!shouldLoad(getState(), id)) {
			return
		}
		dispatch(beginLoading([id]))
		return dispatch({
			type: LOAD_STUDENT,
			payload: loadStudentFunc(id),
		})
	}
}

export default function loadStudents() {
	return dispatch => {
		// Get the list of students we know about, or the string 'null',
		// if localStorage doesn't have the key 'studentIds'.
		let studentIds = uniq(JSON.parse(localStorage.getItem('studentIds')) || [])
		dispatch(beginLoading(studentIds))

		let promises = map(studentIds, loadStudentFunc)
		return dispatch({
			type: LOAD_STUDENTS,
			payload: Promise.all(promises),
		})
	}
}
