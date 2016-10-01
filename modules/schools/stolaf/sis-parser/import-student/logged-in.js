import Bluebird from 'bluebird'
import {AuthError} from 'modules/lib'
import {extractStudentIds} from './student-ids'
import {COURSES_URL} from './urls'
import {fetchHtml, getText} from './lib'
import {selectOne} from 'css-select'

export function checkIfLoggedIn() {
	if (typeof window !== 'undefined' && window.location.hostname !== 'www.stolaf.edu') {
		return Bluebird.reject(new AuthError('Wrong domain. Student import will only work under the www.stolaf.edu domain.'))
	}
	return fetchHtml(COURSES_URL).then(response => {
		let errorMsg = selectOne('.sis-error', response)
		let badMsg = 'Sorry, your session has timed out; please login again.'
		if (errorMsg && getText(errorMsg) === badMsg) {
			throw new AuthError('Not logged in. Please log into the SIS in another tab, then try again.')
		}
		else if (errorMsg) {
			throw new Error(errorMsg)
		}
		return extractStudentIds(response)
	})
}
