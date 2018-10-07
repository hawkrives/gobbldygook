// @flow

import uniqueId from 'lodash/uniqueId'
import {status, text} from '@gob/lib'
import * as notificationActions from '../modules/notifications/redux/actions'
import LoadDataWorker from './load-data.worker'
import mem from 'mem'

const COURSE_URL = APP_BASE + 'courseData.url'
const AREA_URL = APP_BASE + 'areaData.url'

const actions = {
	notifications: notificationActions,
}

const worker = new LoadDataWorker()

const memFetch: typeof fetch = mem(fetch)

worker.addEventListener('error', msg =>
	console.warn('[main] received error from load-data worker:', msg),
)

worker.addEventListener('message', ({data}: {data: string}) => {
	let {type, message}: DispatchMessage = JSON.parse(data)
	if (type === 'dispatch') {
		const action = actions[message.type][message.action](...message.args)
		global._dispatch && global._dispatch(action)
	}
})

export type DispatchMessage = {
	type: 'dispatch',
	message: {type: string, action: string, args: mixed},
}

export type LoadDataMessageEnum =
	| {type: 'load-from-info', path: string, url: string}
	| {type: 'check-idb-in-worker-support'}
	| {
			type: 'load-term-data',
			term: number,
			courseInfoUrl: string,
			path: string,
	  }
	| DispatchMessage

export type LoadDataMessage = {id: string} & LoadDataMessageEnum

function messageWorker(
	params: LoadDataMessageEnum,
): Promise<{type: string, [key: string]: mixed}> {
	let sourceId = uniqueId()

	return new Promise(resolve => {
		// This is inside of the function so that it doesn't get unregistered too early
		function onMessage({data}: {data: string}) {
			let {id: resultId, ...args} = JSON.parse(data)

			if (resultId === sourceId) {
				worker.removeEventListener('message', onMessage)
				resolve(args)
			}
		}

		worker.addEventListener('message', onMessage)

		let message = {id: sourceId, ...params}
		worker.postMessage(JSON.stringify(message))
	})
}

async function loadDataFile(url) {
	let nonce = Date.now()

	let path = await memFetch(url)
		.then(status)
		.then(text)
		.then(path => path.trim())

	await messageWorker({
		type: 'load-from-info',
		url: `${path}/info.json?${nonce}`,
		path: path,
	})
}

export async function checkSupport(): Promise<boolean> {
	let {supportState} = await messageWorker({
		type: 'check-idb-in-worker-support',
	})
	return Boolean(supportState)
}

export async function loadDataForTerm(term: number): Promise<mixed> {
	let nonce = Date.now()

	if (!navigator.onLine) {
		return
	}

	let path = await memFetch(COURSE_URL)
		.then(status)
		.then(text)
		.then(path => path.trim())

	await messageWorker({
		type: 'load-term-data',
		term: term,
		courseInfoUrl: `${path}/info.json?${nonce}`,
		path: path,
	})
}

export default async function loadData() {
	const infoFiles = [COURSE_URL, AREA_URL]

	if (navigator.onLine) {
		await Promise.all(infoFiles.map(loadDataFile))
	} else {
		if (!global._dispatch) {
			return
		}

		let action = notificationActions.logError({
			id: 'offline',
			error: 'You appear to be offline. No information was downloaded.',
		})
		global._dispatch(action)
	}
}
