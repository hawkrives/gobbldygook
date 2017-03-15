'use strict'
const { AuthError } = require('../../../lib')
const { extractStudentIds } = require('./student-ids')
const { COURSES_URL } = require('./urls')
const { fetchHtml, getText } = require('./lib')
const { selectOne } = require('css-select')

module.exports.checkPageIsLoggedIn = checkPageIsLoggedIn
function checkPageIsLoggedIn(response) {
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

module.exports.checkIfLoggedIn = checkIfLoggedIn
function checkIfLoggedIn() {
	return fetchHtml(COURSES_URL).then(checkPageIsLoggedIn)
}
