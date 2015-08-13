function supportsIndexedDB() {
	// from http://bl.ocks.org/nolanlawson/c83e9039edf2278047e9
	return new Promise((resolve, reject) => {
		let req = indexedDB.open('test', 1)

		req.onupgradeneeded = e => {
			let db = e.target.result

			db.createObjectStore('one', {
				keyPath: 'key',
			})
			db.createObjectStore('two', {
				keyPath: 'key',
			})
		}

		req.onerror = reject

		req.onsuccess = e => {
			let db = e.target.result

			let tx
			try {
				tx = db.transaction(['one', 'two'], 'readwrite')
			}
			catch (err) {
				reject(err)
				return
			}

			tx.oncomplete = () => {
				db.close()
				resolve(true)
			}

			let req = tx.objectStore('two').put({
				'key': 'true',
			})
			req.onsuccess = () => {}
			req.onerror = reject
		}
	})
}

function supportsFlexbox() {
	return document && 'flex' in document.body.style
}

export default function checkSystemReqirements() {
	let indexedDB = false
	try {
		supportsIndexedDB()
		indexedDB = true
	}
	catch (err) {
		indexedDB = false
	}
	const flexbox = supportsFlexbox()

	return indexedDB && flexbox
}
