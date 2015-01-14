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
		// Given a query object, if it includes a deptnum, grab that, because we can
		// skip to that spot.
		let result = []

		function iterator(cursor) {
			if (!cursor)  {
				return done()
			}

			let value = cursor.value
			if (checkAgainstQuery(query, value)) {
				result.push(value)
			}

			cursor.continue() // go to next key
		}

		function done(err) {
			err ? cb(err) : cb(null, result)
		}

		this.cursor({ iterator }, done)
	}
}


export default function plugin() {
	return query
}
