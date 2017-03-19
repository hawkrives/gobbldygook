// @flow

import range from 'idb-range'
import fromPairs from 'lodash/fromPairs'
import map from 'lodash/map'
import series from 'p-series'
import debug from 'debug'
import db from '../../db'
import getCacheStoreName from './get-cache-store-name'
import type { InfoFileTypeEnum } from './types'
const log = debug('worker:load-data:clean-prior-data')

export function getPriorCourses(path: string) {
    return db
        .store('courses')
        .index('sourcePath')
        .getAll(range({ eq: path }))
        .then(oldItems => fromPairs(map(oldItems, item => [item.clbid, null])))
}

export function getPriorAreas(path: string) {
    return db
        .store('areas')
        .getAll(range({ eq: path }))
        .then(oldItems =>
            fromPairs(map(oldItems, item => [item.sourcePath, null])))
}

export default function cleanPriorData(path: string, type: InfoFileTypeEnum) {
    log(path)

    let future
    if (type === 'courses') {
        future = getPriorCourses(path)
    } else if (type === 'areas') {
        future = getPriorAreas(path)
    } else {
        log(`"${type}" is not a valid store type`)
        throw new TypeError(
            `cleanPriorData: "${type}" is not a valid store type`
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
