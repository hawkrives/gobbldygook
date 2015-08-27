import map from 'lodash/collection/map'
import Immutable from 'immutable'
import getCourse from './get-course'

/**
 * Gets a list of course ids from the database.
 *
 * @param {Array|Immutable.List} clbids - a list of class/lab IDs
 * @returns {Promise[]} - an array of course promises
 * @fulfill {Array} - the courses.
 */
export default async function getCourses(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for
	// those clbids.

	// console.log('called getCourses', clbids)
	if (Immutable.List.isList(clbids)) {
		clbids = clbids.toArray()
	}

	return await* map(clbids, getCourse)
}
