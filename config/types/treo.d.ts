// treo@0.6.0-rc2 ships no types. This covers the parts gobbldygook uses.
// Stored values come back as `unknown` unless the caller names a type.
declare module "treo" {
  import type { RangeOptions } from "idb-range"

  type Key = IDBValidKey
  type Range = RangeOptions | Key | IDBKeyRange | null | undefined

  type CursorOptions = {
    range?: Range
    direction?: IDBCursorDirection
    iterator: (cursor: IDBCursorWithValue) => void
  }

  export class Schema {
    // With a number, starts that version's changes; without one, reads the
    // latest version.
    version(): number
    version(version: number): this
    addStore(
      name: string,
      options?: { key?: string; increment?: boolean },
    ): this
    getStore(name: string): this
    delStore(name: string): this
    addIndex(
      name: string,
      field: string | string[],
      options?: { unique?: boolean; multiEntry?: boolean },
    ): this
    delIndex(name: string): this
    stores(): Array<unknown>
    callback(): (event: IDBVersionChangeEvent) => void
  }

  export class Index {
    store: Store
    name: string
    field: string | string[]
    multi: boolean | undefined
    unique: boolean | undefined
    get<T = unknown>(key: Key): Promise<T | undefined>
    getAll<T = unknown>(range?: Range): Promise<Array<T>>
    count(range?: Range): Promise<number>
    cursor(options: CursorOptions): Promise<void>
  }

  export class Store {
    db: Database
    name: string
    key: string | undefined
    // the names of this store's indexes
    indexes: Array<string>
    index(name: string): Index
    put(key: Key, value?: unknown): Promise<Key>
    add(key: Key, value?: unknown): Promise<Key>
    get<T = unknown>(key: Key): Promise<T | undefined>
    del(key: Key): Promise<void>
    count(range?: Range): Promise<number>
    clear(): Promise<void>
    // Puts each value under its key, or deletes the key when it's null.
    batch(ops: Readonly<Record<string, unknown>>): Promise<void>
    getAll<T = unknown>(range?: Range): Promise<Array<T>>
    cursor(options: CursorOptions): Promise<void>
  }

  export class Transaction {}

  type Plugin = (db: Database, treo: typeof Database) => void

  export class Database {
    constructor(name: string, schema: Schema)
    static Store: typeof Store
    static Index: typeof Index
    name: string
    version: number
    status: "close" | "opening" | "open" | "error"
    // the names of this database's stores
    stores: Array<string>
    use(plugin: Plugin): this
    del(): Promise<void>
    close(): Promise<void>
    store(name: string, transaction?: Transaction): Store
    transaction(
      scope: string | string[],
      mode?: "read" | "write" | IDBTransactionMode,
    ): Transaction
    getInstance(): Promise<IDBDatabase>
  }

  type Treo = typeof Database & {
    schema: typeof Schema
    Schema: typeof Schema
    Database: typeof Database
    Transaction: typeof Transaction
    Store: typeof Store
    Index: typeof Index
    Promise: PromiseConstructorLike
  }

  const treo: Treo
  export default treo
}
