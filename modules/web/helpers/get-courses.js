import db from './db'
import map from 'lodash/map'
import omit from 'lodash/omit'

const courseCache = Object.create(null)
// Gets a course from the database.
// @param {Number} clbid - a class/lab ID
// @param {Number} term - a course term
// @param {Object} fabrications - a (clbid, course) object of fabrications
// @returns {Promise} - TreoDatabasePromise
// @fulfill {Object} - the course object, potentially with an embedded error message.
export function getCourse({ clbid, term }, fabrications={}) {
	if (clbid in fabrications) {
		return fabrications[clbid]
	}

	if (clbid in courseCache) {
		return courseCache[clbid]
	}

	let promise = db.store('courses')
		.index('clbid')
		.get(clbid)
		.then(course => course || { clbid, term, error: `Could not find ${clbid}` })
		.then(course => omit(course, ['profWords', 'words', 'sourcePath']))
		.catch(error => ({ clbid, term, error: error.message }))

	courseCache[clbid] = promise

	return courseCache[clbid].then(course => {
		delete courseCache[clbid]
		return course
	})
}
// export function getCourse({clbid, term}) {
// 	return db.store('courses')
// 		.index('clbid')
// 		.get(clbid)
// 		.then(course => course || {clbid, term, error: `Could not find ${clbid}`})
// 		.catch(error => ({clbid, term, error: error.message}))
// }


/**
 * Takes a list of clbids, and returns a list of the course objects for those
 * clbids.
 *
 * @param {Number[]} clbids - a list of class/lab IDs
 * @param {Object} fabrications - a list of fabrications
 * @returns {Promise} - a promise for the course data
 * @fulfill {Object[]} - the courses.
 */
export function getCourses(clbids, fabrications) {
	return Promise.all(map(clbids, c => getCourse(c, fabrications)))
}
