const uniqueId = require('lodash/uniqueId')
import { status, text } from '../../lib/fetch-helpers'
import debug from 'debug'
const log = debug('worker:load-data')

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
worker.onerror = msg => log('[main] received error from load-data worker:', msg)
worker.onmessage = ({ data: [resultId, type, actionInfo] }) => {
	if (resultId === null && type === 'dispatch') {
		const action = actions[actionInfo.type][actionInfo.action](...actionInfo.args)
		global.dispatch && global.dispatch(action)
	}
}

function loadDataFile(url) {
	return new Promise((resolve, reject) => {
		const sourceId = uniqueId()
		const cachebuster = Date.now()

		// This is inside of the function so that it doesn't get unregistered too early
		function onMessage({ data: [resultId, type, contents] }) {
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
			.then(path => {
				worker.postMessage([sourceId, `${path}/info.json?${cachebuster}`, path])
			})
			.catch(reject)
	})
}

export function checkSupport() {
	return new Promise(resolve => {
		let sourceId = '__check-idb-worker-support'
		// This is inside of the function so that it doesn't get unregistered too early
		function onMessage({ data: [resultId, type, contents] }) {
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
		return Promise.all(infoFiles.map(loadDataFile))
	}
	else {
		return Promise.resolve(null)
	}
}
