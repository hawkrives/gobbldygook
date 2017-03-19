// @flow

import map from 'lodash/map'
import round from 'lodash/round'
import present from 'present'
import debug from 'debug'
import prepareCourse from './lib-prepare-course'
import dispatch from './lib-dispatch'
import db from '../../db'
import type { InfoFileTypeEnum } from './types'
const coursesLog = debug('worker:load-data:store-data:courses')
const areasLog = debug('worker:load-data:store-data:areas')

type BasicCourse = Object;
type BasicArea = { type: string };

export function storeCourses(path: string, data: BasicCourse[]) {
    coursesLog(path)

    let coursesToStore = map(data, course => ({
        ...course,
        ...prepareCourse(course),
        sourcePath: path,
    }))

    const start = present()

    const onSuccess = () => {
        const time = round(present() - start, 2)
        coursesLog(`Stored ${coursesToStore.length} courses in ${time}ms.`)
    }

    // istanbul ignore next
    const onFailure = err => {
        const db = err.target.db.name
        const errorName = err.target.error.name

        // istanbul ignore else
        if (errorName === 'QuotaExceededError') {
            dispatch('notifications', 'logError', {
                id: 'db-storage-quota-exceeded',
                message: `The database "${db}" has exceeded its storage quota.`,
            })
        }

        throw err
    }

    return db.store('courses').batch(coursesToStore).then(onSuccess, onFailure)
}

export function storeArea(path: string, data: BasicArea) {
    areasLog(path)

    const area = {
        ...data,
        type: data.type.toLowerCase(),
        sourcePath: path,
        dateAdded: new Date(),
    }

    return db.store('areas').put(area)
}

export default function storeData(
    path: string,
    type: InfoFileTypeEnum,
    data: any
) {
    // istanbul ignore else
    if (type === 'courses') {
        return storeCourses(path, data)
    } else if (type === 'areas') {
        return storeArea(path, data)
    }
}
