// @flow

import yaml from 'js-yaml'
import type { InfoFileTypeEnum } from './types'

export default function parseData(raw: string, type: InfoFileTypeEnum) {
    try {
        if (type === 'courses') {
            return JSON.parse(raw)
        } else if (type === 'areas') {
            let data = yaml.safeLoad(raw)
            data.source = raw
            return data
        }
    } catch (err) {
        // ignoring the error
    }
    return {}
}
