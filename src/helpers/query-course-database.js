import db from './db'
import buildQueryFromString from '../helpers/build-query-from-string'
import compact from 'lodash/compact'
import filter from 'lodash/filter'
import map from 'lodash/map'
import some from 'lodash/some'
import toPairs from 'lodash/toPairs'
import fromPairs from 'lodash/fromPairs'

export default function queryCourseDatabase(queryString, baseQuery={}) {
	let queryObject = buildQueryFromString(queryString, {words: true, profWords: true})

	let query = {}
	if ('year' in queryObject || 'semester' in queryObject) {
		query = queryObject
	}
	else {
		query = {...baseQuery, ...queryObject}
	}

	// make sure that all values are wrapped in arrays
	query = toPairs(query)
	query = map(query, ([key, val]) => {
		if (!Array.isArray(val)) {
			val = [val]
		}
		if (some(val, v => v === undefined)) {
			val = compact(val)
		}
		return [key, val]
	})
	query = filter(query, ([_, val]) => val.length)
	query = fromPairs(query)

	console.log('query object', query)

	return db
		.store('courses')
		.query(query)
		.catch(err => new Error(`course query failed on "${queryString}" with error "${err}"`))
}
