import db from './db'

export default function searchForCourseMatches(queryObject) {
	// console.log("searched for: ", queryObject)
	// let start = performance.now()

	return db
		.store('courses')
		.query(queryObject)
		// .then((results) => {console.log(`${performance.now() - start}ms to finish query for ${queryObject.term}`, results, queryObject); return results})
		.catch(err => new Error('course query failed on', queryObject, err))
}
