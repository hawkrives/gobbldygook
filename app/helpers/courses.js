import _ from 'lodash'
import Promise from 'bluebird'
import Immutable from 'immutable'

import db from './db'

import checkCoursesFor from 'sto-helpers/lib/checkCoursesFor'
import queryCourses from './queryCourses'


/**
 * Gets a course from the database.
 *
 * @param {Number} clbid - a class/lab ID
 * @promise TreoDatabasePromise
 * @fulfill {Object} - the course object.
 * @reject {Error} - a message about retrieval failing.
 */
function getCourse(clbid) {
	// console.log('called getCourse', clbid)
	return db.store('courses')
		.get(clbid)
		.catch((err) => new Error(`course retrieval failed for ${clbid}`, err))
}


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

	return Promise.all(clbids.map(getCourse))
}


export {
	getCourse,
	getCourses,
	queryCourses,

	checkCoursesFor
}

window.courseStuff = {
	getCourse,
	getCourses,
	queryCourses,

	checkCoursesFor,
}
