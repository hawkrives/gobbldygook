// @flow

import db from '../db'
import getCacheStoreName from './get-cache-store-name'
import type { InfoFileTypeEnum } from './types'

export default function needsUpdate(
    type: InfoFileTypeEnum,
    path: string,
    hash: string
) {
    return db.store(getCacheStoreName(type)).get(path).then(dbresult => {
        return dbresult ? dbresult.hash !== hash : true
    })
}
