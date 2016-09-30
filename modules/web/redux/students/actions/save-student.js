import saveStudentFunc from '../../../helpers/save-student'

import {SAVE_STUDENT} from '../constants'

export function saveStudent(id) {
	return (dispatch, getState) => {
		const student = getState().students[id].data.present
		const saving = saveStudentFunc(student)
		return dispatch({ type: SAVE_STUDENT, payload: saving })
	}
}
