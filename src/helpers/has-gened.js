import curry from 'lodash/function/curry'
import contains from 'lodash/collection/contains'
import startsWith from 'lodash/string/startsWith'
import hasFOL from './has-fol'

/**
 * Checks if a course has a gened.
 *
 * @param {String} gened
 * @param {Course} course
 * @returns {Boolean}
 */
let hasGenEd = curry((gened, course) => {
	if (startsWith(gened, 'FOL')) {
		return hasFOL(course)
	}
	return contains(course.gereqs, gened)
})

export default hasGenEd
