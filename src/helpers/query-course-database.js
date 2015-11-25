import db from './db'
import buildQueryFromString from '../helpers/build-query-from-string'

function queryCourseDatabase(queryString, baseQuery={}) {
	let queryObject = buildQueryFromString(queryString, {words: true, profWords: true})

	let query = {}
	if ('year' in queryObject || 'semester' in queryObject) {
		query = queryObject
	}
	else {
		query = {...baseQuery, ...queryObject}
	}
	console.log('query object', query)

	return db
		.store('courses')
		.query(query)
		.catch(err => new Error(`course query failed on "${queryString}" with error "${err}"`))
}

export default queryCourseDatabase
