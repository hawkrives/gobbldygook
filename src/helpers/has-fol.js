import any from 'lodash/collection/any'
import startsWith from 'lodash/string/startsWith'

/**
 * Checks if a course has an FOL gened.
 *
 * @param {Course} course - the course to check
 * @returns {Boolean} - if any gereqs are FOL requirements
 */
function hasFOL(course) {
	return any(course.gereqs, req => startsWith(req, 'FOL'))
}

export default hasFOL
