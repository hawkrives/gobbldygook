import includes from 'lodash/includes'
import filter from 'lodash/filter'
import head from 'lodash/head'
import isString from 'lodash/isString'
import extractKeys from 'lodash/keys'
import last from 'lodash/last'
import map from 'lodash/map'
import reject from 'lodash/reject'
import size from 'lodash/size'
import uniq from 'lodash/uniq'
import sortedUniq from 'lodash/sortedUniq'
import flatten from 'lodash/flatten'
import startsWith from 'lodash/startsWith'
import sortBy from 'lodash/sortBy'
import debug from 'debug'
const log = debug('web:database:query')

import idbRange from 'idb-range'
import { cmp as idbComparison } from 'treo'
import { checkCourseAgainstQuery } from '../../../search-queries'

function canAdd({ query, value, primaryKey, results } = {}) {
    // Check if we want to add the current value to the results array.
    // Essentially, make sure that the current value passes the query,
    // and then that it's not already in the array.
    // Note that because JS checks against identity, we use isEqual to
    // do an equality check against the two objects.
    return (
        checkCourseAgainstQuery(query, value) && !includes(results, primaryKey)
    )
}

const preferredKeyOrder = ['deptnum']
const sortKeys = key => {
    let idx = preferredKeyOrder.indexOf(key)
    if (idx >= 0) {
        return idx
    }
    return undefined
}

function queryStore(query) {
    return new Promise((resolvePromise, rejectPromise) => {
        // Take a query object.
        // Grab a key out of it to operate on an index.
        // Set up a range from the low and high value from the values for that key.
        // Iterate over that range and index, checking each value against the query
        //     and making sure not to add duplicates.
        // Return the results.

        let results = []

        // Prevent invalid logic from not having a query.
        if (!size(query)) {
            return results
        }

        // Grab a key from the query to use as an index.
        // TODO: Write a function to sort keys by priority.
        const indexKeys = extractKeys(query)

        // Filter down to just the requested keys that also have indices
        let keysWithIndices = filter(indexKeys, key =>
            includes(this.indexes, key)
        )

        // Prioritize some keys over others
        keysWithIndices = sortBy(keysWithIndices, sortKeys)

        // If the current store has at least one index for a requested key,
        // just run over that index.
        if (size(keysWithIndices)) {
            // We only want to search some indices
            const indices = filter(this.indexes, index =>
                includes(keysWithIndices, index)
            )

            // Run the queries
            const resultPromises = map(indices, indexName =>
                this.index(indexName).query(query, true)
            )

            // Wait for all indices to finish querying before getting their results
            const allFoundKeys = Promise.all(resultPromises)

            // Once we have the primary keys, we need to fetch the actual data:
            let allValues = allFoundKeys
                .then(keys => {
                    // They're in sub-arrays, one for each index, so we
                    // flatten them.
                    // Also, because multiple indices can be running at once,
                    // they might return the same primary keys, so we'll just
                    // de-dupe them here before fetching.
                    return uniq(flatten(keys))
                })
                // and then we actually go fetch them
                .then(keys => this.batchGet(keys))

            // Once they've been fetched, resolve the promise with the results.
            allValues.then(resolvePromise)
        } else {
            // Otherwise, if the current store doesn't have an index for any of
            // the requested keys, iterate over the entire store.
            const done = err => {
                if (err) rejectPromise(err)
                this.batchGet(results).then(resolvePromise)
            }

            let iterateStore = cursor => {
                let { value, primaryKey } = cursor
                if (canAdd({ query, value, primaryKey, results })) {
                    results.push(primaryKey)
                }
                cursor.continue()
            }

            this.cursor({ iterator: iterateStore }).then(done)
        }
    })
}

function queryIndex(query, primaryKeysOnly = false) {
    let name = this.name
    log(query)

    return new Promise((resolvePromise, rejectPromise) => {
        // - takes a query object
        // - filters down the props to just the current index's name
        // - if there aren't any keys to look for under the current index, return []
        // - otherwise, execute the query

        let results = []

        // Prevent invalid logic from not having a query.
        if (!query || !size(query) || !size(query[name])) {
            resolvePromise(results)
        }

        // The index of our current key
        let currentIndex = 0

        // The keys to look for; the list of permissible values for that range from the query
        let keys = query[name]
        keys = reject(keys, key => startsWith(key, '$'))

        if (!keys.length) {
            resolvePromise(results)
        }

        // If we have any keys, sort them according to the IDB spec
        keys = sortBy(keys, idbComparison)
        keys = sortedUniq(keys)

        let firstKey = head(keys)
        let lastKey = last(keys)

        // A range to limit ourselves to
        let range = idbRange({
            gte: firstKey,
            // If it's a string, append `uffff` because that's the highest
            // value in Unicode, which lets us make sure and iterate over all
            // values that we need.
            // hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb
            lte: isString(lastKey) ? lastKey + 'uffff' : lastKey,
        })

        let done = err => {
            if (err) {
                rejectPromise(err)
            } else if (primaryKeysOnly) {
                resolvePromise(results)
            } else {
                this.store.batchGet(results).then(resolvePromise)
            }
        }

        function iterateIndex(cursor) {
            log('cursor:', cursor)
            log(
                'key:',
                keys[currentIndex],
                'idx:',
                currentIndex,
                'size:',
                keys.length
            )
            log('keys:', keys)

            if (currentIndex > keys.length) {
                log('done')
                // If we're out of keys, quit.
                done()
            } else if (cursor.key > keys[currentIndex]) {
                log('greater')
                // If the cursor's key is "past" the current one, we need to skip
                // ahead to the next one key in the list of keys.
                let { value, primaryKey } = cursor
                if (canAdd({ query, value, primaryKey, results })) {
                    log('adding', value)
                    results.push(primaryKey)
                }
                currentIndex += 1

                // If we attempt to continue to a key that is before or equal
                // to the current cursor.key, IDB throws an error.
                // Therefore, if the current key equals the current key, we
                // just go forward by one.
                let nextKey =
                    keys[currentIndex] <= cursor.key
                        ? undefined
                        : keys[currentIndex]
                cursor.continue(nextKey)
            } else if (cursor.key === keys[currentIndex]) {
                log('equals')
                // If we've found what we're looking for, add it, and go to
                // the next result.
                let { value, primaryKey } = cursor
                if (canAdd({ query, value, primaryKey, results })) {
                    log('adding', value)
                    results.push(primaryKey)
                }
                cursor.continue()
            } else {
                log('other')
                // Otherwise, we're not there yet, and need to skip ahead to the
                // first occurrence of our current key.
                cursor.continue(keys[currentIndex])
            }
        }

        this.cursor({ range, iterator: iterateIndex }).then(done)
    })
}

function plugin() {
    return (db, treo) => {
        treo.Store.prototype.query = queryStore
        treo.Index.prototype.query = queryIndex
    }
}

export default plugin
