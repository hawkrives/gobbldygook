/* global jest */
// @flow

import treo from "treo"

// Use fake-indexeddb if real IndexedDB is not available (Node.js), but use real IndexedDB when possible (browser)
if (typeof global.indexedDB === "undefined") {
  const fakeIndexedDB = require("fake-indexeddb")
  global.indexedDB = fakeIndexedDB.indexedDB
  global.IDBIndex = fakeIndexedDB.IDBIndex
  global.IDBKeyRange = fakeIndexedDB.IDBKeyRange
  global.IDBObjectStore = fakeIndexedDB.IDBObjectStore
}

// $FlowExpectedError
const { createDatabase } = jest.requireActual("../index")

treo.Database.prototype.__clear = function clearDatabase() {
  return Promise.all(this.stores.map((s) => this.store(s).clear()))
}

export { createDatabase }
