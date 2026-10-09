import treo from "treo"

declare module "treo" {
  interface Database {
    // Empties every store; only the Jest mock defines this.
    __clear(): Promise<void[]>
  }
}

// Use fake-indexeddb if real IndexedDB is not available (Node.js), but use real IndexedDB when possible (browser)
if (typeof globalThis.indexedDB === "undefined") {
  globalThis.indexedDB = require("fake-indexeddb") as IDBFactory
  globalThis.IDBIndex =
    require("fake-indexeddb/lib/FDBIndex") as typeof IDBIndex
  globalThis.IDBKeyRange =
    require("fake-indexeddb/lib/FDBKeyRange") as typeof IDBKeyRange
  globalThis.IDBObjectStore =
    require("fake-indexeddb/lib/FDBObjectStore") as typeof IDBObjectStore
}

const { createDatabase } =
  jest.requireActual<typeof import("../index")>("../index")

treo.Database.prototype.__clear = function clearDatabase() {
  return Promise.all(this.stores.map((s) => this.store(s).clear()))
}

export { createDatabase }
