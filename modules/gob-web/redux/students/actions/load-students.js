import uniq from 'lodash/uniq'

import {loadStudent} from './load-student'

export function loadStudents() {
	return dispatch => {
		// Get the list of students we know about, or the string 'null',
		// if localStorage doesn't have the key 'studentIds'.
		let studentIds = uniq(
			JSON.parse(localStorage.getItem('studentIds')) || [],
		)

		for (let id of studentIds) {
			dispatch(loadStudent(id))
		}
	}
}
