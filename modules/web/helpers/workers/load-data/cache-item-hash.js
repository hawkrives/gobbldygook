// @flow

import db from '../../db'
import debug from 'debug'
import getCacheStoreName from './get-cache-store-name'
import type { InfoFileTypeEnum } from './types'
const log = debug('worker:load-data:cache-item-hash')

export default function cacheItemHash(
    path: string,
    type: InfoFileTypeEnum,
    hash: string
) {
    log(path)
    return db.store(getCacheStoreName(type)).put({ id: path, path, hash })
}
