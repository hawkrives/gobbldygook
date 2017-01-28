import { getStudentData as getStudentDataFunc } from '../../../helpers/get-student-data'
import { checkStudentGraduatability as checkStudentGraduatabilityFunc } from '../../../helpers/check-student-graduatability'
import { validateSchedules as validateSchedulesFunc } from 'modules/core'

import {
	BEGIN_GET_STUDENT_DATA,
	GET_STUDENT_DATA,
	BEGIN_CHECK_GRADUATABILITY,
	CHECK_GRADUATABILITY,
	BEGIN_VALIDATE_SCHEDULES,
	VALIDATE_SCHEDULES,
} from '../constants'


function getStudent(state, studentId) {
	if (studentId in state.students && state.students[studentId].data.present) {
		return state.students[studentId].data.present
	}
	return {}
}


export function getStudentData(studentId) {
	return (dispatch, getState) => {
		dispatch({ type: BEGIN_GET_STUDENT_DATA, payload: { id: studentId } })
		const state = getState()
		const student = getStudent(state, studentId)
		return dispatch({
			type: GET_STUDENT_DATA,
			payload: getStudentDataFunc(student, state),
		})
	}
}

export function checkStudentGraduatability(studentId) {
	return (dispatch, getState) => {
		dispatch({ type: BEGIN_CHECK_GRADUATABILITY, payload: { id: studentId } })
		const student = getStudent(getState(), studentId)
		return dispatch({
			type: CHECK_GRADUATABILITY,
			payload: checkStudentGraduatabilityFunc(student),
		})
	}
}

export function validateSchedules(studentId) {
	return (dispatch, getState) => {
		dispatch({ type: BEGIN_VALIDATE_SCHEDULES, payload: { id: studentId } })
		const student = getStudent(getState(), studentId)
		return dispatch({
			type: VALIDATE_SCHEDULES,
			payload: validateSchedulesFunc(student),
		})
	}
}

export function checkStudent(studentId) {
	return dispatch => {
		return dispatch(getStudentData(studentId))
			.then(() => dispatch(validateSchedules(studentId)))
			.then(() => dispatch(checkStudentGraduatability(studentId)))
	}
}
