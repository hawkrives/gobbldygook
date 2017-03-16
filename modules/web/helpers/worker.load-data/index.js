// @flow

import 'whatwg-fetch'
import serializeError from 'serialize-error'

import log from './lib-log'
import loadFiles from './load-files'

function checkIdbInWorkerSupport() {
    if (self.IDBCursor) {
        return Promise.resolve(true)
    }
    return Promise.resolve(false)
}

const CHECK_IDB_IN_WORKER_SUPPORT = '__check-idb-worker-support'
self.addEventListener('message', ({ data }) => {
    const [id, ...args] = data
    log('[load-data] received message:', ...args)

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
