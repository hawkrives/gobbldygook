// idb-range@3 ships no types.
declare module "idb-range" {
  export type RangeOptions = {
    gt?: IDBValidKey
    gte?: IDBValidKey
    lt?: IDBValidKey
    lte?: IDBValidKey
    eq?: IDBValidKey
  }

  // Builds an IDBKeyRange from Mongo-style bounds. Returns an IDBKeyRange
  // unchanged, and null for no argument.
  export default function range(
    options?: RangeOptions | IDBValidKey | IDBKeyRange | null,
  ): IDBKeyRange | null
}
