import {courseDb} from './db'
import buildQueryFromString from '../helpers/build-query-from-string'

function queryCourseDatabase(queryString) {
	let queryObject = buildQueryFromString(queryString, {words: true, profWords: true})
	console.log('query object', queryObject)

	return courseDb
		.find(queryObject)
		.catch(err => new Error(`course query failed on "${queryString}" with error "${err}"`))
}

export default queryCourseDatabase
