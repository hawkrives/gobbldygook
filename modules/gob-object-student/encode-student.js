// @flow

import stringify from 'stabilize'
import {Student} from './student'

export function encodeStudent(student: Student) {
	return encodeURIComponent(stringify(student))
}
