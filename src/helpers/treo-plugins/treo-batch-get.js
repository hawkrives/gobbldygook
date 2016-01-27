import Bluebird from 'bluebird'
import { request, requestTransaction } from 'idb-request'

function batchGet(keys) {
	let results = []
	if (!keys.length) {
		return Bluebird.resolve(results)
	}

	return this.db.getInstance()
		.then(db => {
			const tr = db.transaction(this.name, 'readonly')
			const store = tr.objectStore(this.name)

			const requests = keys.map(k => request(store.get(k)))
			requests.push(requestTransaction(tr)) // add the transactions promise

			return Bluebird.all(requests)
		})
		.then(results => {
			results.pop() // remove the transaction promise
			return results
		})
}

export default function plugin() {
	return (db, treo) => {
		let {Store} = treo

		Store.prototype.batchGet = batchGet
	}
}
