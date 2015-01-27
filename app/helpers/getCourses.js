import {map} from 'lodash'
import Immutable from 'immutable'
import Promise from 'bluebird'
import getCourse from './getCourse'

/**
 * Gets a list of course ids from the database.
 *
 * @param {Array|Immutable.List} clbids - a list of class/lab IDs
 * @promise BluebirdPromiseArray
 * @fulfill {Array} - the courses.
 */
function getCourses(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for
	// those clbids.

	// console.log('called getCourses', clbids)
	if (Immutable.List.isList(clbids))
		clbids = clbids.toJS()

	return Promise.all(map(clbids, getCourse))
}

export default getCourses
