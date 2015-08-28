import {courseDb} from './db'

export default function searchForCourseMatches(queryObject) {
	// console.log("searched for: ", queryObject)
	// let start = performance.now()

	return courseDb
		.find(queryObject)
		// .then((results) => {console.log(`${performance.now() - start}ms to finish query for ${queryObject.term}`, results, queryObject); return results})
		.catch(err => {
			console.log('course query failed on', queryObject, err)
			throw err
		})
}
