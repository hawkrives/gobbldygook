// @flow

import {db} from './db'
import fromPairs from 'lodash/fromPairs'
import getCacheStoreName from './get-cache-store-name'
import type {InfoFileTypeEnum} from './types'

export async function getPriorCourses(path: string) {
	let numericClbids = db
		.store('courses')
		.getAll(IDBKeyRange.bound(-Infinity, Infinity))
		.then(oldItems => fromPairs(oldItems.map(item => [item.clbid, null])))

	let oldClbids = db
		.store('courses')
		.index('sourcePath')
		.getAll(IDBKeyRange.only(path))
		.then(oldItems => fromPairs(oldItems.map(item => [item.clbid, null])))

	return [...new Set([...numericClbids, ...oldClbids])]
}

export function getPriorAreas(path: string) {
	return db
		.store('areas')
		.getAll(IDBKeyRange.only(path))
		.then(oldItems =>
			fromPairs(oldItems.map(item => [item.sourcePath, null])),
		)
}

export default async function cleanPriorData(
	path: string,
	type: InfoFileTypeEnum,
) {
	console.log(`cleaning ${path}`)

	let operations
	if (type === 'courses') {
		operations = await getPriorCourses(path)
	} else if (type === 'areas') {
		operations = await getPriorAreas(path)
	} else {
		console.warn(`"${type}" is not a valid store type`)
		throw new TypeError(`"${type}" is not a valid store type`)
	}

	await db.store(type).batch(operations)
	await db.store(getCacheStoreName(type)).del(path)
}
