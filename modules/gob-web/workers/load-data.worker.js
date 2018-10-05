// @flow

import serializeError from 'serialize-error'
import {loadFiles} from '@gob/worker-load-data'
import {IS_WORKER} from './lib'

declare var self: DedicatedWorkerGlobalScope
const CHECK_IDB_IN_WORKER_SUPPORT = '__check-idb-worker-support'

function checkIdbInWorkerSupport() {
	if ((self: any).IDBCursor) {
		return Promise.resolve(true)
	}
	return Promise.resolve(false)
}

function main({data}) {
	const [id, ...args] = JSON.parse(data)
	// console.log('received message:', ...args)

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

if (IS_WORKER) {
	// $FlowFixMe {data} is not in event… except that it is
	self.addEventListener('message', main)
}

class PointlessExportForTestingAndFlow {
	addEventListener(_1: string, _2: Function) {}
	removeEventListener(_1: string, _2: Function) {}
	postMessage(_: string) {}
}

export default PointlessExportForTestingAndFlow
