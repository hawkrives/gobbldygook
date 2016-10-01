const Bluebird = require('bluebird')
const uniqueId = require('lodash/uniqueId')
import {status, text} from 'modules/lib'

import * as notificationActions from '../redux/notifications/actions'
import * as courseActions from '../redux/courses/actions'
import * as areaActions from '../redux/areas/actions'
const actions = {
	notifications: notificationActions,
	courses: courseActions,
	areas: areaActions,
}

const LoadDataWorker = require('./load-data.worker.js')
const worker = new LoadDataWorker()
worker.onerror = msg => console.warn('[main] received error from load-data worker:', msg)
worker.onmessage = ({data: [resultId, type, actionInfo]}) => {
	if (resultId === null && type === 'dispatch') {
		const action = actions[actionInfo.type][actionInfo.action](...actionInfo.args)
		global.dispatch && global.dispatch(action)
	}
}

function loadDataFile(url) {
	return new Bluebird(async resolve => {
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

		let path = await fetch(url).then(status).then(text)
		path = path.trim()
		worker.postMessage([sourceId, `${path}/info.json?${cachebuster}`, path])
	})
}

export function checkSupport() {
	return new Bluebird(async resolve => {
		let sourceId = '__check-idb-worker-support'
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
		worker.postMessage([sourceId])
	})
}

export default function loadData() {
	const infoFiles = [
		APP_BASE + 'courseData.url',
		APP_BASE + 'areaData.url',
	]

	if (navigator.onLine) {
		return Bluebird.map(infoFiles, loadDataFile)
	}
	else {
		return Bluebird.resolve(null)
	}
}
