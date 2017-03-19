// @flow

import series from 'p-series'
import debug from 'debug'
import { status, text } from '../../../../lib/fetch-helpers'
import dispatch from './lib-dispatch'

import parseData from './parse-data'
import cleanPriorData from './clean-prior-data'
import storeData from './store-data'
import cacheItemHash from './cache-item-hash'

import type { InfoFileTypeEnum } from './types'

const log = debug('worker:load-data:update-database')
const fetchText = (...args) => fetch(...args).then(status).then(text)

export default function updateDatabase(
    type: InfoFileTypeEnum,
    infoFileBase: string,
    notificationId: string,
    // Get the path to the current file and the hash of the file
    { path, hash }: { path: string, hash: string }
) {
    log(path)

    // Append the hash, to act as a sort of cache-busting mechanism
    const url = `${infoFileBase}/${path}?v=${hash}`

    const nextStep = rawData => {
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
    }

    const onFailure = () => {
        log(`Could not fetch ${url}`)
        dispatch('notifications', 'incrementProgress', notificationId)
        return false
    }

    const onSuccess = () => {
        log(`added ${path}`)
        dispatch('notifications', 'incrementProgress', notificationId)
        return true
    }

    // go fetch the data!
    return fetchText(url).then(nextStep).then(onSuccess).catch(onFailure)
}
