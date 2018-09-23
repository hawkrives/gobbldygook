// @flow

import serializeError from 'serialize-error'
import debug from 'debug'
import {loadFiles} from '@gob/worker-load-data'
import {IS_WORKER} from './lib'
const log = debug('worker:load-data:listener')

function checkIdbInWorkerSupport() {
	if (self.IDBCursor) {
		return Promise.resolve(true)
	}
	return Promise.resolve(false)
}

function main({data}) {
	const [id, ...args] = data
	log('received message:', ...args)

	if (id === CHECK_IDB_IN_WORKER_SUPPORT) {
		checkIdbInWorkerSupport()
			.then(result => self.postMessage([id, 'result', result]))
			.catch(err => self.postMessage([id, 'error', serializeError(err)]))
		return
	}

	loadFiles(...args)
		.then(result => self.postMessage([id, 'result', result]))
		.catch(err => self.postMessage([id, 'error', serializeError(err)]))
}

const CHECK_IDB_IN_WORKER_SUPPORT = '__check-idb-worker-support'

if (IS_WORKER) {
	self.addEventListener('message', main)
}

export default class {}
