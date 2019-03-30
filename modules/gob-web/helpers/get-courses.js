// @flow

import {db} from './db'
import {status, json} from '@gob/lib'
import type {Course as CourseType, Result} from '@gob/types'
import {List} from 'immutable'

const baseUrl = 'https://stolaf.dev/course-data'

const networkCache: Map<string, Promise<CourseType>> = new Map()
export function getCourseFromNetwork(clbid: string): Promise<CourseType> {
	let cached = networkCache.get(clbid)
	if (cached) {
		return cached
	}

	const id = clbid
	const dir = (Math.floor(parseInt(clbid, 10) / 1000) * 1000).toString()

	const path = `${baseUrl}/courses/${dir}/${id}.json`

	let request: Promise<any> = fetch(path)
		.then(status)
		.then(json)

	networkCache.set(clbid, request)

	return request.then(course => {
		networkCache.delete(clbid)
		return (course: any)
	})
}

const courseCache: Map<string, Promise<CourseType>> = new Map()
export function getCourseFromDatabase(clbid: string): Promise<CourseType> {
	let cached = courseCache.get(clbid)
	if (cached) {
		return cached
	}

	let dbRequest = db
		.store('courses')
		.index('clbid')
		.get(clbid)
		.then(course => (course ? course : getCourseFromNetwork(clbid)))
		.then(({profWords, words, sourcePath, ...course}) => course)

	courseCache.set(clbid, dbRequest)

	return dbRequest.then(course => {
		courseCache.delete(clbid)
		return course
	})
}

// Gets a course from the database.
export async function getCourse(
	clbid: string,
	term?: ?number,
	fabrications?: ?(Array<CourseType> | List<CourseType>) = [],
): Promise<Result<CourseType>> {
	if (fabrications) {
		let fab = fabrications.find(c => c.clbid === clbid)
		if (fab) {
			return {error: false, result: fab, meta: {fabrication: true}}
		}
	}

	let getCourseFrom = getCourseFromDatabase
	if (global.useNetworkOnly) {
		getCourseFrom = getCourseFromNetwork
	}

	try {
		let course = await getCourseFrom(clbid)
		if (!course) {
			return {
				error: true,
				result: new Error(`Could not find ${clbid}`),
				meta: {clbid, term},
			}
		}
		return {error: false, result: course}
	} catch (error) {
		return {error: true, result: error}
	}
}
