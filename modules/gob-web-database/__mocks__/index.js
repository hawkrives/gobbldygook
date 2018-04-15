/* eslint-env jest */
// @flow

import treo from 'treo'

// Use fake-indexeddb if real IndexedDB is not available (Node.js), but use real IndexedDB when possible (browser)
if (typeof global.indexedDB === 'undefined') {
    global.indexedDB = require('fake-indexeddb')
    global.IDBIndex = require('fake-indexeddb/lib/FDBIndex')
    global.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')
    global.IDBObjectStore = require('fake-indexeddb/lib/FDBObjectStore')
}

// $FlowFixMe
const {createDatabase} = require.requireActual('../index')

treo.Database.prototype.__clear = function clearDatabase() {
    return Promise.all(this.stores.map(s => this.store(s).clear()))
}

export {createDatabase}
