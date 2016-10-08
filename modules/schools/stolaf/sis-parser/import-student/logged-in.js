import {AuthError} from 'modules/lib'
import {extractStudentIds} from './student-ids'
import {COURSES_URL} from './urls'
import {fetchHtml, getText} from './lib'
import {selectOne} from 'css-select'

export async function checkPageIsLoggedIn(response) {
	let errorMsg = selectOne('[style="text-align:center"]', response)
	let badMsg = 'Please use your St. Olaf Google account when accessing SIS.'
	if (errorMsg && getText(errorMsg) === badMsg) {
		throw new AuthError('Not logged in. Please log into the SIS in another tab, then try again.')
	}
	else if (errorMsg) {
		throw new Error(errorMsg)
	}
	return extractStudentIds(response)
}

export function checkIfLoggedIn() {
	return fetchHtml(COURSES_URL).then(checkPageIsLoggedIn)
}
