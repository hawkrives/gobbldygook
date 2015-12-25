import map from 'lodash/collection/map'
import {status, text} from './fetch-helpers'
import uniqueId from 'lodash/utility/uniqueId'

import Worker from './load-data.worker.js'
const worker = new Worker()
worker.onerror = msg => console.warn('[main] received error from load-data worker:', msg)

function loadDataFile(url) {
	return new Promise((resolve, reject) => {
		const sourceId = uniqueId()
		const cachebuster = Date.now()

		// This is inside of the function so that it doesn't get unregistered too early
		function onMessage({data: [resultId, type, contents]}) {
			if (type === 'dispatch') {
				typeof window !== 'undefined' && window.dispatch && window.dispatch(contents)
			}

			if (resultId === sourceId) {
				worker.removeEventListener('message', onMessage)

				if (type === 'result') {
					resolve(contents)
				}
				else if (type === 'error') {
					reject(contents)
				}
			}
		}

		worker.addEventListener('message', onMessage)

		fetch(url)
			.then(status)
			.then(text)
			.then(path => path.trim())
			.then(path => worker.postMessage([sourceId, `${path}/info.json?${cachebuster}`, path]))
	})
}

export default function loadData() {
	const infoFiles = [
		'./courseData.url',
		'./areaData.url',
	]

	const promises = map(infoFiles, url => loadDataFile(url).catch(err => console.error(err)))

	return Promise.all(promises)
}
