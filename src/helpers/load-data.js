import map from 'lodash/collection/map'
import {status, text} from './fetch-helpers'
import uniqueId from 'lodash/utility/uniqueId'

import * as notificationActions from '../ducks/actions/notifications'
import * as courseActions from '../ducks/actions/courses'
import * as areaActions from '../ducks/actions/areas'
const actions = {
	notifications: notificationActions,
	courses: courseActions,
	areas: areaActions,
}

import Worker from './load-data.worker.js'
const worker = new Worker()
worker.onerror = msg => console.warn('[main] received error from load-data worker:', msg)
worker.onmessage = ({data: [resultId, type, actionInfo]}) => {
	if (resultId === null && type === 'dispatch') {
		const action = actions[actionInfo.type][actionInfo.action](...actionInfo.args)
		typeof window !== 'undefined' && window.dispatch && window.dispatch(action)
	}
}

function loadDataFile(url) {
	return new Promise((resolve, reject) => {
		const sourceId = uniqueId()
		const cachebuster = Date.now()

		// This is inside of the function so that it doesn't get unregistered too early
		function onMessage({data: [resultId, type, contents]}) {
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
