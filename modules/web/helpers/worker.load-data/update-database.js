// @flow

import series from 'p-series'
import { status, text } from '../../../lib/fetch-helpers'
import dispatch from './lib-dispatch'
import log from './lib-log'

import parseData from './parse-data'
import cleanPriorData from './clean-prior-data'
import storeData from './store-data'
import cacheItemHash from './cache-item-hash'

import type { InfoFileTypeEnum } from './types'

const fetchText = (...args) => fetch(...args).then(status).then(text)

export default function updateDatabase(
    type: InfoFileTypeEnum,
    infoFileBase: string,
    notificationId: string,
    infoFromServer: any
) {
    // Get the path to the current file and the hash of the file
    const { path, hash } = infoFromServer
    // Append the hash, to act as a sort of cache-busting mechanism
    const itemUrl = `/${path}?v=${hash}`

    log(`updateDatabase(): ${path}`)

    const url = infoFileBase + itemUrl

    // go fetch the data!
    return fetchText(url)
        .then(
            rawData => {
                // now parse the data into a usable form
                const data = parseData(rawData, type)

                return series([
                    // clear out any old data
                    () => cleanPriorData(path, type),
                    // store the new data
                    () => storeData(path, type, data),
                    // record that we stored the new data
                    () => cacheItemHash(path, type, hash),
                ])
            },
            () => {
                log(`Could not fetch ${url}`)
                return false
            }
        )
        .then(() => {
            log(`added ${path}`)
            dispatch('notifications', 'incrementProgress', notificationId)
        })
}
