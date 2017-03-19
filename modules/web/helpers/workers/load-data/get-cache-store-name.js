// @flow

import debug from 'debug'
import type { InfoFileTypeEnum } from './types'
const log = debug('worker:load-data:get-cache-store-name')

export default function getCacheStoreName(type: InfoFileTypeEnum) {
    if (type === 'courses') {
        return 'courseCache'
    } else if (type === 'areas') {
        return 'areaCache'
    } else {
        log(`"${type}" is not a valid store type`)
        throw new TypeError(
            `getCacheStoreName(): "${type}" is not a valid store type`
        )
    }
}
