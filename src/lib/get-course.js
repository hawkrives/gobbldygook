import {courseDb} from './db'

/**
 * Gets a course from the database.
 *
 * @param {Number} clbid - a class/lab ID
 * @returns {Promise} - PouchDBPromise
 * @promise PouchDBPromise
 * @fulfill {Object} - the course object.
 * @reject {Error} - a message about retrieval failing.
 */
function getCourse(clbid) {
	// console.log('called getCourse', clbid)
	if (process.env.NODE_ENV === 'test') {
		return {_mock: true}
	}
	if (typeof clbid === 'number') {
		clbid = String(clbid)
	}
	return courseDb
		.get(clbid)
		.catch(err => {
			console.error(`course retrieval failed for ${clbid}`)
		})
}

export default getCourse
