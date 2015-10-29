import {cmp} from 'treo'

/**
 * Efficient way to get bunch of records by `keys`.
 * Inspired by: https://hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb/
 *
 * Examples:
 *
 *   var books = db.store('books')
 *   books.findIn(['book-1', 'book-2', 'book-n']).then(fn)
 *
 *   var byAuthor = books.index('byAuthor')
 *   byAuthor.findIn(['Fred', 'Barney']).then(fn)
 *
 * SQL equivalent:
 *
 *   SELECT * FROM BOOKS WHERE ID IN ('book-1', 'book-2', 'book-n')
 *   SELECT * FROM BOOKS WHERE AUTHOR IN ('Fred', 'Barney')
 *
 * @param {Array} keys
 */
function findIn(keys) {
	return new Promise((resolve, reject) => {
		let result = []
		let current = 0
		keys = keys.sort(cmp)

		function iterator(cursor) {
			if (current > keys.length) {
				return done()
			}
			if (cursor.key > keys[current]) {
				result.push(undefined) // key not found
				current += 1
				cursor.continue(keys[current])
			}
			else if (cursor.key === keys[current]) {
				result.push(cursor.value) // key found
				current += 1
				cursor.continue(keys[current])
			}
			else {
				cursor.continue(keys[current]) // go to next key
			}
		}

		function done(err) {
			if (err) {
				reject(err)
			}
			else {
				resolve(result)
			}
		}

		this.cursor({ iterator }, done)
	})
}

export default function plugin(db, treo) {
	treo.Index.prototype.findIn = findIn
	treo.Store.prototype.findIn = findIn
}
