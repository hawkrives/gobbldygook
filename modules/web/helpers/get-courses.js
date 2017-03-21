// @flow
import db from './db'
import map from 'lodash/map'
import omit from 'lodash/omit'
import padStart from 'lodash/padStart'
import {status, json} from '../../lib/fetch-helpers'

const baseUrl = 'https://stodevx.github.io/course-data'
const networkCache = Object.create(null)
export function getCourseFromNetwork(clbid: number) {
    if (clbid in networkCache) {
        return networkCache[clbid]
    }

    const id = padStart(clbid.toString(), 10, '0')
    const dir = (Math.floor(clbid / 1000) * 1000).toString()

    const path = `${baseUrl}/courses/${dir}/${id}.json`

    networkCache[clbid] = fetch(path).then(status).then(json)

    return networkCache[clbid]
}

const courseCache = Object.create(null)
export function getCourseFromDatabase(clbid: number) {
    if (clbid in courseCache) {
        return courseCache[clbid]
    }

    courseCache[clbid] = db
        .store('courses')
        .index('clbid')
        .get(clbid)
        .then(course => omit(course, ['profWords', 'words', 'sourcePath']))

    return courseCache[clbid].then(course => {
        delete courseCache[clbid]
        return course
    })
}

// Gets a course from the database.
// @param {Number} clbid - a class/lab ID
// @param {Number} term - a course term
// @param {Object} fabrications - a (clbid, course) object of fabrications
// @returns {Promise} - TreoDatabasePromise
// @fulfill {Object} - the course object, potentially with an embedded error message.
export function getCourse({ clbid, term }: {clbid: number, term: number}, fabrications: any = {}) {
    if (clbid in fabrications) {
        return fabrications[clbid]
    }

    let getCourseFrom = getCourseFromDatabase
    if (global.useNetworkOnly) {
        getCourseFrom = getCourseFromNetwork
    }

    return getCourseFrom(clbid)
        .then(course => course || { clbid, term, error: `Could not find ${clbid}` })
        .catch(error => ({ clbid, term, error: error.message }))
}

/**
 * Takes a list of clbids, and returns a list of the course objects for those
 * clbids.
 *
 * @param {Number[]} clbids - a list of class/lab IDs
 * @param {Object} fabrications - a list of fabrications
 * @returns {Promise} - a promise for the course data
 * @fulfill {Object[]} - the courses.
 */
export function getCourses(clbids: number[], fabrications: any) {
    return Promise.all(map(clbids, c => getCourse(c, fabrications)))
}
