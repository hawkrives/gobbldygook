// @flow

import map from 'lodash/map'
import round from 'lodash/round'
import size from 'lodash/size'
import present from 'present'
import debug from 'debug'
import prepareCourse from './lib-prepare-course'
import dispatch from './lib-dispatch'
import db from '../../db'
import type { InfoFileTypeEnum } from './types'
const coursesLog = debug('worker:load-data:store-data:courses')
const areasLog = debug('worker:load-data:store-data:areas')

function storeCourses(path, data) {
    coursesLog(path)

    let coursesToStore = map(data, course => ({
        ...course,
        ...prepareCourse(course),
        sourcePath: path,
    }))

    const start = present()
    return db
        .store('courses')
        .batch(coursesToStore)
        .then(() => {
            const time = round(present() - start, 2)
            coursesLog(`Stored ${size(coursesToStore)} courses in ${time}ms.`)
        })
        .catch(err => {
            const db = err.target.db.name
            const errorName = err.target.error.name

            if (errorName === 'QuotaExceededError') {
                dispatch('notifications', 'logError', {
                    id: 'db-storage-quota-exceeded',
                    message: `The database "${db}" has exceeded its storage quota.`,
                })
            }

            throw err
        })
}

function storeArea(path, data) {
    areasLog(path)

    let area = {
        ...data,
        type: data.type.toLowerCase(),
        sourcePath: path,
        dateAdded: new Date(),
    }

    return db.store('areas').put(area).catch(err => {
        throw err
    })
}

export default function storeData(
    path: string,
    type: InfoFileTypeEnum,
    data: any
) {
    // store the new data
    if (type === 'courses') {
        return storeCourses(path, data)
    } else if (type === 'areas') {
        return storeArea(path, data)
    }
}
