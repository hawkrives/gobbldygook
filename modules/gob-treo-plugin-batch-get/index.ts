import { request, requestTransaction } from "idb-request"
import type { Database, Store } from "treo"

declare module "treo" {
  interface Store {
    // Gets the value for each key in one transaction, in the same order.
    batchGet<T = unknown>(keys: ReadonlyArray<IDBValidKey>): Promise<Array<T>>
  }
}

function batchGet<T>(
  this: Store,
  keys: ReadonlyArray<IDBValidKey>,
): Promise<Array<T>> {
  if (!keys.length) {
    return Promise.resolve([])
  }

  return this.db.getInstance().then(async (db) => {
    const tr = db.transaction(this.name, "readonly")
    const store = tr.objectStore(this.name)

    const requests = keys.map((k) => request<T>(store.get(k)))

    // wait for the transaction to finish too
    const [results] = await Promise.all([
      Promise.all(requests),
      requestTransaction(tr),
    ])
    return results
  })
}

export default function plugin() {
  return (_db: Database, treo: typeof Database): void => {
    treo.Store.prototype.batchGet = batchGet
  }
}
