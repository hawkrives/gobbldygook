// import queryTreoDatabase from 'path/to/queryTreoDatabase'
// let db = treo('databaseName', schema)
//   .use(queryTreoDatabase)

import Promise from 'bluebird'
import idbRange from 'idb-range'
import {any, first, last, filter, isString, isEqual} from 'lodash'
import checkAgainstQuery from 'sto-helpers/lib/checkCourseAgainstQuery'

function query(db, treo) {
	let {Store} = treo

	/**
	 * Examples:
	 *
	 *   let books = db.store('books')
	 *   books.query({dept: ['$AND', 'AMCON', 'GCON']}).then()
	 *
	 *   let byAuthor = books.index('byAuthor')
	 *   byAuthor.query({dept: ['$AND', 'AMCON', 'GCON']}).then()
	 *
	 * @param {Object} query
	 * @returns {Promise}
	 */
	Store.prototype.query = function(query) {
		return new Promise((resolve, reject) => {
			// Take a query object.
			// Grab a key out of it to operate on an index.
			// Set up a range from the low and high value from the values for that key.
			// Iterate over that range and index, checking each value against the query
			//     and making sure not to add duplicates.
			// Return the results.

			let results = []
			// Prevent invalid logic from not having a query.
			if (!query || Object.keys(query).length === 0)
				return results

			// The index of our current key
			let current = 0
			// Grab a key from the query to use as an index.
			// TODO: Write a function to sort keys by preference.
			let indexKeys = Object.keys(query)
			// The index to limit ourselves to, if any
			let index = undefined
			// Which iterator to use (iterateIndex, unless there aren't any indices)
			let iterator = iterateIndex
			// The keys to look for
			let keys = undefined
			// A range to limit ourselves to (only applicable in an index)
			let range = undefined

			// Filter down to just the requested keys that also have indices
			let keysWithIndices = filter(indexKeys, (key) => this.index(key))

			// If the current store doesn't have an index for any of the
			// requested keys, iterate over the entire store.
			if (keysWithIndices.length === 0) {
				iterator = iterateEntireStore
			}
			else {
				index = first(keysWithIndices)

				// `keys` is the list of permissible values for that range from the query
				keys = query[index]
				if (keys.length) {
					// If we have any keys, sort them according to the IDB spec
					keys = keys.sort(treo.cmp)

					let firstKey = first(keys)
					let lastKey = last(keys)
					range = idbRange({
						gte: firstKey,
						// If it's a string, append `uffff` because that's the highest
						// value in Unicode, which lets us make sure and iterate over all
						// values that we need.
						// hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb
						lte: isString(lastKey) ? lastKey + 'uffff' : lastKey,
					})
				}
			}

			function canAdd(query, currentValue) {
				// Check if we want to add the current value to the results array.
				// Essentially, make sure that the current value passes the query,
				// and then that it's not already in the array.
				// Note that because JS checks against identity, we use isEqual to
				// do an equality check against the two objects.
				return checkAgainstQuery(query, currentValue) &&
					!any(results, val => isEqual(val, currentValue))
			}

			function iterateEntireStore(cursor) {
				let value = cursor.value
				if (canAdd(query, value)) {
					results.push(value)
				}
				cursor.continue()
			}

			function iterateIndex(cursor) {
				// console.log('cursor', cursor)
				// console.log('key', keys[current], 'idx', current)

				if (current > keys.length) {
					// If we're out of keys, quit.
					// console.log('done')
					return done()
				}

				else if (cursor.key > keys[current]) {
					// If the cursor's key is "past" the current one, we need to skip
					// ahead to the next one key in the list of keys.
					// console.log('greater')
					let value = cursor.value
					if (canAdd(query, value)) {
						// console.log('adding', value)
						results.push(value)
					}
					current += 1
					// If we attempt to continue to a key that is before or equal
					// to the current cursor.key, IDB throws an error.
					// Therefore, if the current key equals the current key, we
					// just go forward by one.
					let nextKey = keys[current] === cursor.key ?
						undefined : keys[current]
					cursor.continue(nextKey)
				}

				else if (cursor.key === keys[current]) {
					// If we've found what we're looking for, add it, and go to
					// the next result.
					// console.log('equals')
					let value = cursor.value
					if (canAdd(query, value)) {
						// console.log('adding', value)
						results.push(value)
					}
					cursor.continue()
				}

				else {
					// Otherwise, we're not there yet, and need to skip ahead to the
					// first occurrence of our current key.
					// console.log('other')
					cursor.continue(keys[current])
				}
			}

			function done(err) {
				// console.log('done fn')
				err ? reject(err) : resolve(results)
			}

			this.cursor({iterator, range, index}, done)
		})
	}
}

export default function plugin() {
	return query
}
