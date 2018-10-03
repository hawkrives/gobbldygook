// @flow

import uniqueId from 'lodash/uniqueId'
import {status, text} from '@gob/lib'
import * as notificationActions from '../modules/notifications/redux/actions'
import LoadDataWorker from './load-data.worker'

const actions = {
	notifications: notificationActions,
}

const worker = new LoadDataWorker()

worker.addEventListener('error', msg =>
	console.warn('[main] received error from load-data worker:', msg),
)

worker.addEventListener('message', ({data: [resultId, type, actionInfo]}) => {
	if (resultId === null && type === 'dispatch') {
		const action = actions[actionInfo.type][actionInfo.action](
			...actionInfo.args,
		)
		global._dispatch && global._dispatch(action)
	}
})

function loadDataFile(url) {
	return new Promise(async (resolve, reject) => {
		const sourceId = uniqueId()
		const cachebuster = Date.now()

		// This is inside of the function so that it doesn't get unregistered too early
		function onMessage({data: [resultId, type, contents]}) {
			if (resultId === sourceId) {
				worker.removeEventListener('message', onMessage)

				if (type === 'result') {
					resolve(contents)
				} else if (type === 'error') {
					resolve(contents)
				}
			}
		}

		worker.addEventListener('message', onMessage)

		try {
			let path = await fetch(url)
				.then(status)
				.then(text)

			path = path.trim()

			let message = [sourceId, `${path}/info.json?${cachebuster}`, path]
			worker.postMessage(JSON.stringify(message))
		} catch (error) {
			reject(error)
		}
	})
}

export function checkSupport(): Promise<boolean | string> {
	return new Promise(resolve => {
		let sourceId = '__check-idb-worker-support'
		// This is inside of the function so that it doesn't get unregistered too early
		function onMessage({data}: {data: [string, string, boolean | string]}) {
			let [resultId, type, contents] = data
			if (resultId === sourceId) {
				worker.removeEventListener('message', onMessage)

				if (type === 'result') {
					resolve(contents)
				} else if (type === 'error') {
					resolve(contents)
				}
			}
		}
		worker.addEventListener('message', onMessage)
		worker.postMessage(JSON.stringify([sourceId]))
	})
}

export default function loadData() {
	const infoFiles = [APP_BASE + 'courseData.url', APP_BASE + 'areaData.url']

	if (navigator.onLine) {
		return Promise.all(infoFiles.map(loadDataFile))
	} else {
		return Promise.resolve(null)
	}
}
