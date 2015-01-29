import db from './db'
import {buildQueryFromString} from 'sto-helpers'

function queryCourseDatabase(queryString) {
	let queryObject = buildQueryFromString(queryString, {words: true, profWords: true})
	console.log('query object', queryObject)

	return db
		.store('courses')
		.query(queryObject)
		.catch(err => new Error(`course query failed on "${queryString}" with error "${err}"`))
}

export default queryCourseDatabase
