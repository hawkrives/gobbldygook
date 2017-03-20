// @flow

import 'whatwg-fetch'
import serializeError from 'serialize-error'
import debug from 'debug'
import loadFiles from './load-data/load-files'
const log = debug('worker:load-data:listener')

function checkIdbInWorkerSupport() {
    if (self.IDBCursor) {
        return Promise.resolve(true)
    }
    return Promise.resolve(false)
}

const CHECK_IDB_IN_WORKER_SUPPORT = '__check-idb-worker-support'
self.addEventListener('message', ({ data }) => {
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
})

export default class {}
