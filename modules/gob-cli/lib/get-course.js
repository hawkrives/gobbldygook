// @flow

import got from 'got'
import type {FabricationType} from '@gob/object-student'
import type {Course as CourseType} from '@gob/types'

const Keyv = require('keyv')
const KeyvFile = require('keyv-file')

const keyv = new Keyv({
	store: new KeyvFile(),
})

type ErrorType = {
	clbid: string,
	term: number,
	error: string,
}

const baseUrl = 'https://stodevx.github.io/course-data'

export async function getCourseFromNetwork(clbid: string) {
	const id = clbid
	const dir = (Math.floor(parseInt(clbid, 10) / 1000) * 1000).toString()

	const path = `${baseUrl}/courses/${dir}/${id}.json`

	return (await got(path, {json: true, cache: keyv})).body
}

export function getCourse(
	{clbid, term}: {clbid: string, term: number},
	fabrications?: ?{[key: string]: FabricationType} = {},
): Promise<CourseType | FabricationType | ErrorType> {
	if (fabrications && clbid in fabrications) {
		return Promise.resolve(fabrications[clbid])
	}

	return getCourseFromNetwork(clbid)
		.then(
			course => course || {clbid, term, error: `Could not find ${clbid}`},
		)
		.catch(error => ({clbid, term, error: error.message}))
}

export function getOnlyCourse(args: {
	clbid: string,
	term: number,
}): Promise<CourseType | null> {
	let {clbid} = args
	return getCourseFromNetwork(clbid).catch(() => null)
}
