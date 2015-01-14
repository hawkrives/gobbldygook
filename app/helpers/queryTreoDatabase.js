// import queryTreoDatabase from 'path/to/queryTreoDatabase'
// let db = treo('databaseName', schema)
//   .use(queryTreoDatabase)

import checkAgainstQuery from 'sto-helpers/lib/checkCourseAgainstQuery'

function query(db) {
	let treo = db.constructor
	let {Index, Store} = treo

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
	 * @param {Function} cb - cb(err, result)
	 */
	Index.prototype.query =
	Store.prototype.query = function(query, cb) {
		// Take a query object.
		// If it includes a deptnum, grab that, because we can
		//   skip to that spot.
		// Otherwise, iterate over the entire database.

		let result = []
		let currentIndex = 0
		let keys = query.deptnum || query.keys || []
		let range = undefined
		if (keys.length) {
			keys = keys.map(key => key.replace(' ', '_'))
			keys = keys.sort(treo.cmp)
			range = treo.range({gte: keys[0], lte: keys[keys.length-1] + 'uffff'})
		}

		function iterator(cursor) {
			// console.log(cursor)
			// console.log(keys[currentIndex], currentIndex)

			if (!keys.length) {
				let value = cursor.value
				if (checkAgainstQuery(query, value)) {
					result.push(value)
				}
				cursor.continue()
			}

			else if (currentIndex > keys.length)  {
				// console.log('done')
				return done()
			}

			else if (typeof cursor.key !== 'string') {
				cursor.continue()
			}

			else if (cursor.key > keys[currentIndex] && !cursor.key.startsWith(keys[currentIndex])) {
				// console.log('greater')
				let value = cursor.value
				let isMatch = checkAgainstQuery(query, value)
				if (isMatch) {
					result.push(value)
				}
				currentIndex += 1
				cursor.continue(isMatch ? undefined : keys[currentIndex])
			}

			else if (cursor.key.startsWith(keys[currentIndex])) {
				// console.log('startsWith')
				let value = cursor.value
				if (checkAgainstQuery(query, value)) {
					result.push(value)
				}
				cursor.continue()
			}

			else {
				// console.log('other')
				cursor.continue(keys[currentIndex])
			}
		}

		function done(err) {
			err ? cb(err) : cb(null, result)
		}

		this.cursor({ iterator, range }, done)
	}
}

export default function plugin() {
	return query
}
