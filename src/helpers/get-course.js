import db from './db'

const courseCache = Object.create(null)

/**
 * Gets a course from the database.
 *
 * @param {Number} clbid - a class/lab ID
 * @returns {Promise} - TreoDatabasePromise
 * @promise TreoDatabasePromise
 * @fulfill {Object} - the course object.
 * @reject {Error} - a message about retrieval failing.
 */
export default async function getCourse(clbid) {
	// console.log('called getCourse', clbid)

	if (clbid in courseCache) {
		let value = courseCache[clbid]
		if (value instanceof Promise) {
			return await value
		}
		else {
			return value
		}
		return courseCache[clbid]
	}

	let course
	try {
		courseCache[clbid] = db.store('courses').index('clbid').get(clbid)
		course = await courseCache[clbid]
	}
	catch (error) {
		return {clbid, error}
	}

	courseCache[clbid] = course

	return course
}

// export default function getCourse(clbid) {
// 	return db
// 		.store('courses')
// 		.index('clbid')
// 		.get(clbid)
// 		.catch(error => ({clbid, error}))
// }
