// @flow

import {db} from './db'
import {buildQueryFromString} from '@gob/search-queries'
import compact from 'lodash/compact'
import toPairs from 'lodash/toPairs'
import fromPairs from 'lodash/fromPairs'

export function queryCourseDatabase(
	queryString: string,
	baseQuery: Object = {},
) {
	let queryObject = buildQueryFromString(queryString, {
		words: true,
		profWords: true,
	})

	// make sure that all values are wrapped in arrays
	let filteredQuery = toPairs({...baseQuery, ...queryObject})
		.map(([key, val]) => {
			if (!Array.isArray(val)) {
				val = [val]
			}
			if (val.some(v => v === undefined)) {
				val = compact(val)
			}
			return [key, val]
		})
		.filter(([_, val]) => val.length)

	let finalQuery = fromPairs(filteredQuery)

	return db
		.store('courses')
		.query(finalQuery)
		.catch(
			err =>
				new Error(
					`course query failed on "${queryString}" with error "${err}"`,
				),
		)
}
