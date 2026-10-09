import treo from "treo"

declare module "treo" {
  interface Database {
    // Empties every store; only the test mock defines this.
    __clear(): Promise<void[]>
  }
}

// Use fake-indexeddb if real IndexedDB is not available (Node.js), but use real IndexedDB when possible (browser)
if (typeof globalThis.indexedDB === "undefined") {
  const fake = await import("fake-indexeddb")
  globalThis.indexedDB = fake.indexedDB
  globalThis.IDBIndex = fake.IDBIndex
  globalThis.IDBKeyRange = fake.IDBKeyRange
  globalThis.IDBObjectStore = fake.IDBObjectStore
}

const { createDatabase } =
  await vi.importActual<typeof import("../index.ts")>("../index.ts")

treo.Database.prototype.__clear = function clearDatabase() {
  return Promise.all(this.stores.map((s) => this.store(s).clear()))
}

export { createDatabase }
