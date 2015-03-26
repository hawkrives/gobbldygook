import Promise from 'bluebird'

function plugin(db, treo) {
	let {Store} = treo

	Store.prototype.batchGet = batchGet
}

export default plugin

function batchGet(keys) {
	if (!keys.length) {
		return Promise.resolve([])
	}

	return new Promise((resolve, reject) => {
		let name = this.name

		this.db.transaction('readonly', [name], function(err, tr) {
			if (err) {
				reject(err)
			}

			let store = tr.objectStore(name)
			let current = 0
			let results = []

			tr.onerror = tr.onabort = reject
			tr.oncomplete = function oncomplete() { resolve(results) }
			next()

			function next() {
				if (current >= keys.length) {
					return
				}

				let currentKey = keys[current]
				current += 1

				let request = store.get(currentKey)
				request.onerror = reject
				request.onsuccess = function(ev) {
					results.push(ev.target.result)
					next()
				}
			}
		})
	})
}
