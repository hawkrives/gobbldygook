import db from './db'

/**
 * Gets a course from the database.
 *
 * @param {Number} clbid - a class/lab ID
 * @returns {Promise} - TreoDatabasePromise
 * @promise TreoDatabasePromise
 * @fulfill {Object} - the course object.
 * @reject {Error} - a message about retrieval failing.
 */
function getCourse(clbid) {
	// console.log('called getCourse', clbid)
	return db
		.store('courses')
		.index('clbid')
		.get(clbid)
		.catch(error => ({clbid, error}))
}

export default getCourse
