// @flow
import {db} from './db'
import {status, json} from '@gob/lib'
import type {FabricationType} from '@gob/object-student'
import type {Course as CourseType} from '@gob/types'

type ErrorType = {
	clbid: string,
	term: number,
	error: string,
}

const baseUrl = 'https://stodevx.github.io/course-data'
const networkCache = Object.create(null)
export function getCourseFromNetwork(clbid: string) {
	if (clbid in networkCache) {
		return networkCache[clbid]
	}

	const id = clbid
	const dir = (Math.floor(parseInt(clbid, 10) / 1000) * 1000).toString()

	const path = `${baseUrl}/courses/${dir}/${id}.json`

	networkCache[clbid] = fetch(path)
		.then(status)
		.then(json)

	return networkCache[clbid]
}

const courseCache = Object.create(null)
export function getCourseFromDatabase(clbid: string) {
	if (clbid in courseCache) {
		return courseCache[clbid]
	}

	courseCache[clbid] = db
		.store('courses')
		.index('clbid')
		.get(clbid)
		.then(course => (course ? course : getCourseFromNetwork(clbid)))
		.then(({profWords: _p, words: _w, sourcePath: _s, ...course}) => course)

	return courseCache[clbid].then(course => {
		delete courseCache[clbid]
		return course
	})
}

// Gets a course from the database.
export function getCourse(
	{clbid, term}: {clbid: string, term: number},
	fabrications?: ?{[key: string]: FabricationType} = {},
): Promise<CourseType | FabricationType | ErrorType> {
	if (fabrications && clbid in fabrications) {
		return Promise.resolve(fabrications[clbid])
	}

	let getCourseFrom = getCourseFromDatabase
	if (global.useNetworkOnly) {
		getCourseFrom = getCourseFromNetwork
	}

	return getCourseFrom(clbid)
		.then(
			course => course || {clbid, term, error: `Could not find ${clbid}`},
		)
		.catch(error => ({clbid, term, error: error.message}))
}
