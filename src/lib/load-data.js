import map from 'lodash/collection/map'
import {status, text} from './fetch-helpers'

import Worker from './load-data.worker.js'
const worker = new Worker()
// worker.onmessage = msg => console.log('[main] received message from load-data worker:', msg)
worker.onerror = msg => console.log('[main] received error from load-data worker:', msg)
worker.addEventListener('message', ({data}) => {
	if (data && data[0] === 'dispatch') {
		typeof window !== 'undefined' && window.dispatch && window.dispatch(data[1])
	}
})

export default function loadData() {
	const cachebuster = Date.now()

	const infoFiles = [
		'./courseData.url',
		'./areaData.url',
	]

	const promises = map(infoFiles,
		file => fetch(file)
			.then(status)
			.then(text)
			.then(path => path.trim())
			.then(path => {
				worker.postMessage([`${path}/info.json?${cachebuster}`, path])
			})
			.catch(err => {
				console.error(err)
			}))

	return Promise.all(promises)
}
