// fake-indexeddb 3 has no types. Each entry point is CommonJS whose
// module.exports is the IndexedDB global it stands in for.

declare module "fake-indexeddb" {
  const indexedDB: IDBFactory
  export default indexedDB
}

declare module "fake-indexeddb/lib/FDBIndex.js" {
  const FDBIndex: typeof IDBIndex
  export default FDBIndex
}

declare module "fake-indexeddb/lib/FDBKeyRange.js" {
  const FDBKeyRange: typeof IDBKeyRange
  export default FDBKeyRange
}

declare module "fake-indexeddb/lib/FDBObjectStore.js" {
  const FDBObjectStore: typeof IDBObjectStore
  export default FDBObjectStore
}
