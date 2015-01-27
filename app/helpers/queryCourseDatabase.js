import db from './db'
import {buildQueryFromString} from 'sto-helpers'

function queryCourseDatabase(queryString) {
	let queryObject = buildQueryFromString(queryString)
	console.log('query object', queryObject)

	return db
		.store('courses')
		.query(queryObject)
		.catch(err => new Error('course query failed on', queryString, err))
}

export default queryCourseDatabase
