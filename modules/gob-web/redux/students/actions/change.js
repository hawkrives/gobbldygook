// @flow

import {Student} from '@gob/object-student'
import {saveStudent} from '../../../helpers/save-student'

export const CHANGE_STUDENT: 'gobbldygook/students/CHANGE_STUDENT' =
	'gobbldygook/students/CHANGE_STUDENT'

type Action = {type: typeof CHANGE_STUDENT, payload: Student}

export type ActionCreator = Student => Action | Promise<Action>

export const action: ActionCreator = async (s: Student) => {
	s = await saveStudent(s)
	return {type: CHANGE_STUDENT, payload: s}
}

export {action as changeStudent}
export type {ActionCreator as ChangeStudentFunc}
