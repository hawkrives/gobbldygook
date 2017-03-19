// @flow

import filter from 'lodash/filter'
import startsWith from 'lodash/startsWith'
import size from 'lodash/size'
import series from 'p-series'
import { status, json } from '../../../../lib/fetch-helpers'
import debug from 'debug'
import dispatch from './lib-dispatch'
import needsUpdate from './needs-update'
import updateDatabase from './update-database'
import removeDuplicateAreas from './remove-duplicate-areas'
import type { InfoFileTypeEnum } from './types'
const log = debug('worker:load-data:load-files')

const fetchJson = (...args) => fetch(...args).then(status).then(json)

export default function loadFiles(url: string, infoFileBase: string) {
    log(url)

    // bad hawken?
    let type: InfoFileTypeEnum
    let notificationId: string
    let filesToLoad

    return fetchJson(url)
        .then(
            infoFile => {
                type = infoFile.type
                notificationId = type
                filesToLoad = infoFile.files

                if (type === 'courses') {
                    // only download the json courses
                    filesToLoad = filesToLoad.filter(
                        file => file.type === 'json'
                    )
                    // Only get the last four years of data
                    const oldestYear = new Date().getFullYear() - 5
                    filesToLoad = filter(
                        filesToLoad,
                        file => file.year >= oldestYear
                    )
                }

                // For each file, see if it needs loading.
                return Promise.all(
                    filesToLoad.map(file =>
                        needsUpdate(type, file.path, file.hash))
                )
            },
            err => {
                if (startsWith(err.message, 'Failed to fetch')) {
                    log(`Failed to fetch ${url}`)
                    return []
                }
                throw err
            }
        )
        .then(filesNeedLoading => {
            // Cross-reference each file to load with the list of files that need loading
            filesToLoad = filter(
                filesToLoad,
                (file, index) => filesNeedLoading[index]
            )

            // Exit early if nothing needs to happen
            if (filesToLoad.length === 0) {
                log(`[${type}] no files need loading`)
                return true
            }

            log(`[${type}] these files need loading:`, ...filesNeedLoading)

            // Fire off the progress bar
            dispatch(
                'notifications',
                'startProgress',
                notificationId,
                `Loading ${type}`,
                { max: size(filesToLoad), showButton: true }
            )

            // Load them into the database
            return series(
                filesToLoad.map(file => {
                    return () =>
                        updateDatabase(
                            type,
                            infoFileBase,
                            notificationId,
                            file
                        )
                })
            )
        })
        .then(
            () => {
                // Clean up the database a bit
                if (type === 'areas') {
                    return removeDuplicateAreas()
                }
            },
            err => {
                throw err
            }
        )
        .then(() => {
            log(`[${type}] done loading`)

            // Remove the progress bar after 1.5 seconds
            dispatch(
                'notifications',
                'removeNotification',
                notificationId,
                1500
            )
            if (type === 'courses') {
                dispatch('courses', 'refreshCourses')
            } else if (type === 'areas') {
                dispatch('areas', 'refreshAreas')
            }

            return true
        })
}
