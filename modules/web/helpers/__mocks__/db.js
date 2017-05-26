/* eslint-env jest */
// @flow

// Use fake-indexeddb if real IndexedDB is not available (Node.js), but use real IndexedDB when possible (browser)
if (typeof global.indexedDB === 'undefined') {
    global.indexedDB = require('fake-indexeddb')
    global.IDBIndex = require('fake-indexeddb/lib/FDBIndex')
    global.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')
    global.IDBObjectStore = require('fake-indexeddb/lib/FDBObjectStore')
}

// $FlowFixMe
const { default: db } = require.requireActual('../db')

db.__clear = function clearDatabase() {
    return Promise.all(db.stores.map(s => db.store(s).clear()))
}

export default db
