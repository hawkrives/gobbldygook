import map from 'lodash/collection/map'
import getCourse from './get-course'

/**
 * Gets a list of course ids from the database.
 *
 * @param {Array} clbids - a list of class/lab IDs
 * @returns {Promise[]} - an array of course promises
 * @fulfill {Array} - the courses.
 */
export default function getCourses(clbids, {year, semester}={}) {
	// Takes a list of clbids, and returns a list of the course objects for
	// those clbids.

	//
	// Current problem: this rejects as soon as one item is rejected.
	// I want an equivalent that waits for *all* items to be either resolved or rejected,
	//   and returns an array of the results or rejections.
	//
	// Solution (probably): Bluebird's Promise.settle
	//

	return Promise.all(map(clbids, getCourse))
		.then(courses => map(courses, course => {
			if (!course || course.error) {
				// embed the year and semester that it came from in the case of an error
				return {...course, year, semester}
			}
			return course
		}))
}
