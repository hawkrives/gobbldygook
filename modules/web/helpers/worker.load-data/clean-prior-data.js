// @flow

import range from 'idb-range'
import fromPairs from 'lodash/fromPairs'
import map from 'lodash/map'
import series from 'p-series'

import db from '../db'
import log from './lib-log'
import getCacheStoreName from './get-cache-store-name'
import type { InfoFileTypeEnum } from './types'

function cleanPriorCourses(path) {
    return db
        .store('courses')
        .index('sourcePath')
        .getAll(range({ eq: path }))
        .then(oldItems => fromPairs(map(oldItems, item => [item.clbid, null])))
}

function cleanPriorAreas(path) {
    return db
        .store('areas')
        .getAll(range({ eq: path }))
        .then(oldItems =>
            fromPairs(map(oldItems, item => [item.sourcePath, null])))
}

export default function cleanPriorData(path: string, type: InfoFileTypeEnum) {
    log(`cleanPriorData(): ${path}`)

    let future
    if (type === 'courses') {
        future = cleanPriorCourses(path)
    } else if (type === 'areas') {
        future = cleanPriorAreas(path)
    } else {
        throw new TypeError(
            `cleanPriorData(): "${type}" is not a valid store type`
        )
    }

    return future.then(
        ops =>
            series([
                db.store(type).batch(ops),
                db.store(getCacheStoreName(type)).del(path),
            ]),
        err => {
            throw err
        }
    )
}
