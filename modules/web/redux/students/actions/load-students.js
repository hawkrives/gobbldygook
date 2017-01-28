import {map} from 'lodash'
import {uniq} from 'lodash'

import {LOAD_STUDENTS} from '../constants'
import {loadStudent} from './load-student'

export function loadStudents() {
	return dispatch => {
		// Get the list of students we know about, or the string 'null',
		// if localStorage doesn't have the key 'studentIds'.
		let studentIds = uniq(JSON.parse(localStorage.getItem('studentIds')) || [])

		return dispatch({
			type: LOAD_STUDENTS,
			payload: Promise.all(map(studentIds, id => dispatch(loadStudent(id)))),
		})
	}
}
