import Promise from 'bluebird'

function batchGet(db, treo) {
	let {Store} = treo

	Store.prototype.batchGet = function(keys) {
		if (!keys.length)
			return Promise.resolve([])

		return new Promise((resolve, reject) => {
			var name = this.name

			this.db.transaction('readonly', [name], function(err, tr) {
				if (err)
					reject(err)

				var store = tr.objectStore(name)
				var current = 0
				var results = []

				tr.onerror = tr.onabort = reject
				tr.oncomplete = function oncomplete() { resolve(results) }
				next()

				function next() {
					if (current >= keys.length)
						return

					var currentKey = keys[current]
					current += 1

					var request = store.get(currentKey)
					request.onerror = reject
					request.onsuccess = function(ev) {
						results.push(ev.target.result)
						next()
					}
				}
			})
		})
	}
}

export default function plugin() {
	return batchGet
}
