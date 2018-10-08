// @flow

import got from 'got'
import type {Course as CourseType, Result} from '@gob/types'
import {List} from 'immutable'

const Keyv = require('keyv')
const KeyvFile = require('keyv-file')

const keyv = new Keyv({
	store: new KeyvFile(),
})

const baseUrl = 'https://stodevx.github.io/course-data'

export async function getCourseFromNetwork(clbid: string) {
	const id = clbid
	const dir = (Math.floor(parseInt(clbid, 10) / 1000) * 1000).toString()

	const path = `${baseUrl}/courses/${dir}/${id}.json`

	return (await got(path, {json: true, cache: keyv})).body
}

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

	try {
		let course = await getCourseFromNetwork(clbid)
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
