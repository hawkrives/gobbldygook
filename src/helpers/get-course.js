import db from './db'

const courseCache = new WeakMap()

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

	if (courseCache.has(clbid)) {
		let value = courseCache.get(clbid)
		if (value instanceof Promise) {
			return await value
		}
		else {
			return value
		}
		return courseCache.get(clbid)
	}

	let course
	try {
		const coursePromise = db.store('courses').index('clbid').get(clbid)
		courseCache.set(clbid, coursePromise)
		course = await coursePromise
	}
	catch (error) {
		return {clbid, error}
	}

	courseCache.set(clbid, course)

	return course
}

// export default function getCourse(clbid) {
// 	return db
// 		.store('courses')
// 		.index('clbid')
// 		.get(clbid)
// 		.catch(error => ({clbid, error}))
// }
