// @flow

import {Student} from '@gob/object-student'
import {saveStudent} from '../../../helpers/save-student'

export const CHANGE_STUDENT: 'gobbldygook/change-student' =
	'gobbldygook/change-student'

type Action = {type: typeof CHANGE_STUDENT, payload: Student}

export type ActionCreator = Student => Action

export const action: ActionCreator = (s: Student) => {
	saveStudent(s)
	return {type: CHANGE_STUDENT, payload: s}
}

export {action as changeStudent}
export type {ActionCreator as ChangeStudentFunc}
