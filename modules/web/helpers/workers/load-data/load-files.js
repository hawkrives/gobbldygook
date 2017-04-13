// @flow

import startsWith from 'lodash/startsWith'
import series from 'p-series'
import { status, json } from '../../../../lib/fetch-helpers'
import debug from 'debug'
import { refreshCourses, refreshAreas, Notification } from './lib-dispatch'
import needsUpdate from './needs-update'
import updateDatabase from './update-database'
import removeDuplicateAreas from './remove-duplicate-areas'
import type { InfoFileTypeEnum, InfoFileRef, InfoIndexFile } from './types'
const log = debug('worker:load-data:load-files')

const filterByTruthiness = arr => arr.filter(Boolean)
const fetchJson = (...args) => fetch(...args).then(status).then(json)

type Args = {|
    baseUrl: string,
    notification: Notification,
    oldestYear: number,
    type: InfoFileTypeEnum,
|}

export default function loadFiles(url: string, baseUrl: string) {
    log(url)

    return fetchJson(url)
        .then(data => proceedWithUpdate(baseUrl, data))
        .catch(err => handleErrors(err, url))
}

export function proceedWithUpdate(baseUrl: string, data: InfoIndexFile) {
    const type: InfoFileTypeEnum = data.type
    const notification = new Notification(type)
    const oldestYear = new Date().getFullYear() - 5
    const args = { type, notification, baseUrl, oldestYear }

    return getFilesToLoad(args, data)
        .then(files => filterFiles(args, files))
        .then(files => slurpIntoDatabase(args, files))
        .then(() => deduplicateAreas(args))
        .then(() => finishUp(args))
}

export function getFilesToLoad(
    { type, oldestYear }: Args,
    data: InfoIndexFile
) {
    let files = data.files

    if (type === 'courses') {
        files = files.filter(f => filterForRecentCourses(f, oldestYear))
    }

    return Promise.resolve(files)
}

export function filterFiles({ type }: Args, files: InfoFileRef[]) {
    // For each file, see if it needs loading. We then update each promise
    // with either the path or `null`.
    const filesToLoad = files.map(file =>
        needsUpdate(type, file.path, file.hash).then(
            update => (update ? file : null)
        )
    )

    // Finally, we filter the items
    return Promise.all(filesToLoad).then(filterByTruthiness)
}

export function slurpIntoDatabase(
    { type, baseUrl, notification }: Args,
    files: InfoFileRef[]
) {
    // Exit early if nothing needs to happen
    if (files.length === 0) {
        log(`[${type}] no files need loading`)
        return
    }

    log(`[${type}] these files need loading:`, ...files)

    // Fire off the progress bar
    notification.start(files.length)

    // Load them into the database
    const runUpdate = file => updateDatabase(type, baseUrl, notification, file)
    return series(files.map(runUpdate))
}

export function deduplicateAreas({ type }: Args) {
    // Clean up the database a bit
    if (type === 'areas') {
        return removeDuplicateAreas()
    }
}

export function finishUp({ type, notification }: Args) {
    log(`[${type}] done loading`)

    // Remove the progress bar after 1.5 seconds
    notification.remove()

    // istanbul ignore else
    if (type === 'courses') {
        refreshCourses()
    } else if (type === 'areas') {
        refreshAreas()
    }
}

function handleErrors(err: Error, url: string) {
    if (startsWith(err.message, 'Failed to fetch')) {
        log(`Failed to fetch ${url}`)
        return
    }
    throw err
}

export function filterForRecentCourses(file: InfoFileRef, oldestYear: number) {
    // Only download the json courses
    const isJson = file.type === 'json'

    // Only get the last four years of data
    const isRecent = file.year && file.year >= oldestYear

    return isJson && isRecent
}
