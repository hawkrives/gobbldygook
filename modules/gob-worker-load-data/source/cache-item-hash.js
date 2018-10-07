// @flow

import {db} from './db'
import getCacheStoreName from './get-cache-store-name'
import type {InfoFileTypeEnum} from './types'

export default function cacheItemHash(
	path: string,
	type: InfoFileTypeEnum,
	hash: string,
) {
	console.log(`caching ${path}`)
	return db.store(getCacheStoreName(type)).put({id: path, path, hash})
}
