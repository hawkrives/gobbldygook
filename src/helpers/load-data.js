import Bluebird from 'bluebird'
import map from 'lodash/map'
import {status, text} from './fetch-helpers'
import uniqueId from 'lodash/uniqueId'

import * as notificationActions from '../redux/notifications/actions'
import * as courseActions from '../redux/courses/actions'
import * as areaActions from '../redux/areas/actions'
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
		global.dispatch && global.dispatch(action)
	}
}

function loadDataFile(url) {
	return new Bluebird(resolve => {
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
					resolve(contents)
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

	if (navigator.onLine) {
		const promises = map(infoFiles, url => loadDataFile(url))

		return Bluebird.all(promises)
	}
	else {
		return Bluebird.resolve(null)
	}
}
