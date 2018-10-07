// @flow

import {Student} from '@gob/object-student'

export const CHANGE_STUDENT: 'gobbldygook/students/CHANGE_STUDENT' =
	'gobbldygook/students/CHANGE_STUDENT'

type Action = {type: typeof CHANGE_STUDENT, payload: Student}

export type ActionCreator = Student => Action

export const action: ActionCreator = (s: Student) => {
	return {type: CHANGE_STUDENT, payload: s}
}

export {action as changeStudent}
export type {ActionCreator as ChangeStudentFunc}
