import includes from "lodash/includes"
import filter from "lodash/filter"
import head from "lodash/head"
import isString from "lodash/isString"
import extractKeys from "lodash/keys"
import last from "lodash/last"
import map from "lodash/map"
import reject from "lodash/reject"
import size from "lodash/size"
import uniq from "lodash/uniq"
import sortedUniq from "lodash/sortedUniq"
import flatten from "lodash/flatten"
import startsWith from "lodash/startsWith"
import sortBy from "lodash/sortBy"

import idbRange from "idb-range"
import type { Database, Index, Store } from "treo"
import { checkCourseAgainstQuery } from "@gob/search-queries"
import type { Query, Queryable, QueryValue } from "@gob/search-queries"

// Store.batchGet comes from @gob/treo-plugin-batch-get, which
// @gob/web-database installs alongside this plugin.
declare module "treo" {
  interface Store {
    // Finds the values that match a search query.
    query<T = unknown>(query: Query): Promise<Array<T>>
  }
  interface Index {
    // Finds the values (or just their primary keys) that match a search
    // query, using this index to narrow the search.
    query<T = unknown>(
      query: Query,
      primaryKeysOnly?: boolean,
    ): Promise<Array<T>>
  }
}

// oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- IDBValidKey can hold ArrayBuffers and views, which are not readonly types
function canAdd({
  query,
  value,
  primaryKey,
  results,
}: {
  query: Query
  value: Queryable
  primaryKey: IDBValidKey
  results: ReadonlyArray<IDBValidKey>
}): boolean {
  // Check if we want to add the current value to the results array.
  // Essentially, make sure that the current value passes the query,
  // and then that it's not already in the array.
  return checkCourseAgainstQuery(query, value) && !includes(results, primaryKey)
}

const preferredKeyOrder = ["deptnum"]
const sortKeys = (key: string): number | undefined => {
  let idx = preferredKeyOrder.indexOf(key)
  if (idx >= 0) {
    return idx
  }
  return undefined
}

// Booleans aren't valid IndexedDB keys, so a query like "pf: true" against
// an index makes IndexedDB throw and the query reject, as it always has.
const toKey = (value: QueryValue): IDBValidKey => value as IDBValidKey

// oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- treo's Store class type is not readonly
function queryStore<T>(this: Store, query: Query): Promise<Array<T>> {
  return new Promise((resolvePromise, rejectPromise) => {
    // Take a query object.
    // Grab a key out of it to operate on an index.
    // Set up a range from the low and high value from the values for that key.
    // Iterate over that range and index, checking each value against the query
    //     and making sure not to add duplicates.
    // Return the results.

    let results: Array<IDBValidKey> = []

    // Prevent invalid logic from not having a query.
    if (!size(query)) {
      resolvePromise([])
      return
    }

    // Grab a key from the query to use as an index.
    // TODO: Write a function to sort keys by priority.
    const indexKeys = extractKeys(query)

    // Filter down to just the requested keys that also have indices
    let keysWithIndices = filter(indexKeys, (key) =>
      includes(this.indexes, key),
    )

    // Prioritize some keys over others
    keysWithIndices = sortBy(keysWithIndices, sortKeys)

    // If the current store has at least one index for a requested key,
    // just run over that index.
    if (size(keysWithIndices)) {
      // We only want to search some indices
      const indices = filter(this.indexes, (index) =>
        includes(keysWithIndices, index),
      )

      // Run the queries
      const resultPromises = map(indices, (indexName) =>
        this.index(indexName).query<IDBValidKey>(query, true),
      )

      // Wait for all indices to finish querying before getting their results
      const allFoundKeys = Promise.all(resultPromises)

      // Once we have the primary keys, we need to fetch the actual data:
      let allValues = allFoundKeys
        .then((keys) => {
          // They're in sub-arrays, one for each index, so we
          // flatten them.
          // Also, because multiple indices can be running at once,
          // they might return the same primary keys, so we'll just
          // de-dupe them here before fetching.
          return uniq(flatten(keys))
        })
        // and then we actually go fetch them
        .then((keys) => this.batchGet<T>(keys))

      // Once they've been fetched, resolve the promise with the results.
      void allValues.then(resolvePromise)
    } else {
      // Otherwise, if the current store doesn't have an index for any of
      // the requested keys, iterate over the entire store.
      const done = () => {
        void this.batchGet<T>(results).then(resolvePromise)
      }

      let iterateStore = (cursor: IDBCursorWithValue) => {
        let { primaryKey } = cursor
        // the stores this plugin queries hold courses
        let value = cursor.value as Queryable
        if (canAdd({ query, value, primaryKey, results })) {
          results.push(primaryKey)
        }
        cursor.continue()
      }

      this.cursor({ iterator: iterateStore }).then(done, rejectPromise)
    }
  })
}

function queryIndex<T>(
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- treo's Index class type is not readonly
  this: Index,
  query: Query,
  primaryKeysOnly = false,
): Promise<Array<T>> {
  let name = this.name

  return new Promise((resolvePromise, rejectPromise) => {
    // - takes a query object
    // - filters down the props to just the current index's name
    // - if there aren't any keys to look for under the current index, return []
    // - otherwise, execute the query

    let results: Array<IDBValidKey> = []

    // Prevent invalid logic from not having a query.
    let values = query[name]
    if (!size(query) || !values || !size(values)) {
      resolvePromise([])
      return
    }

    // The index of our current key
    let currentIndex = 0

    // The keys to look for; the list of permissible values for that range
    // from the query, without the boolean operators
    let keys: Array<QueryValue> = reject(
      values,
      (key) => typeof key === "string" && startsWith(key, "$"),
    )

    if (!keys.length) {
      resolvePromise([])
      return
    }

    // If we have any keys, sort them and drop the duplicates
    keys = sortBy(keys)
    keys = sortedUniq(keys)

    let firstKey = head(keys)
    let lastKey = last(keys)

    // A range to limit ourselves to
    let range = idbRange({
      ...(firstKey !== undefined && { gte: toKey(firstKey) }),
      // If it's a string, append `uffff` because that's the highest
      // value in Unicode, which lets us make sure and iterate over all
      // values that we need.
      // hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb
      ...(lastKey !== undefined && {
        lte: isString(lastKey) ? lastKey + "uffff" : toKey(lastKey),
      }),
    })

    let done = () => {
      if (primaryKeysOnly) {
        resolvePromise(results as Array<T>)
      } else {
        void this.store.batchGet<T>(results).then(resolvePromise)
      }
    }

    function iterateIndex(cursor: IDBCursorWithValue) {
      // The query values are strings, numbers, or booleans, like the keys of
      // the indexes they're run against.
      let cursorKey = cursor.key as QueryValue
      let currentKey = keys[currentIndex]

      if (currentIndex > keys.length) {
        // If we're out of keys, quit.
        done()
      } else if (currentKey !== undefined && cursorKey > currentKey) {
        // If the cursor's key is "past" the current one, we need to skip
        // ahead to the next one key in the list of keys.
        let { primaryKey } = cursor
        // the stores this plugin queries hold courses
        let value = cursor.value as Queryable
        if (canAdd({ query, value, primaryKey, results })) {
          results.push(primaryKey)
        }
        currentIndex += 1

        // If we attempt to continue to a key that is before or equal
        // to the current cursor.key, IDB throws an error.
        // Therefore, if the current key equals the current key, we
        // just go forward by one.
        let nextKey = keys[currentIndex]
        cursor.continue(
          nextKey === undefined || nextKey <= cursorKey
            ? undefined
            : toKey(nextKey),
        )
      } else if (cursorKey === currentKey) {
        // If we've found what we're looking for, add it, and go to
        // the next result.
        let { primaryKey } = cursor
        // the stores this plugin queries hold courses
        let value = cursor.value as Queryable
        if (canAdd({ query, value, primaryKey, results })) {
          results.push(primaryKey)
        }
        cursor.continue()
      } else {
        // Otherwise, we're not there yet, and need to skip ahead to the
        // first occurrence of our current key.
        cursor.continue(
          currentKey === undefined ? undefined : toKey(currentKey),
        )
      }
    }

    this.cursor({ range, iterator: iterateIndex }).then(done, rejectPromise)
  })
}

function plugin() {
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- installs query onto treo.Store.prototype and treo.Index.prototype; treo's Database type is not readonly
  return (_db: Database, treo: typeof Database): void => {
    treo.Store.prototype.query = queryStore
    treo.Index.prototype.query = queryIndex
  }
}

export default plugin
