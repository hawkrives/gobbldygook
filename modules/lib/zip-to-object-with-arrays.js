// @flow
'use strict'
const reduce = require('lodash/reduce')
const zip = require('lodash/zip')
const has = require('lodash/has')

function zipToObjectWithArrays<T>(
    keys: string[],
    vals: T[]
): { [key: string]: Array<T> } {
    let arr = zip(keys, vals)

    return reduce(
        arr,
        (obj, [key, val]) => {
            if (has(obj, key)) {
                obj[key].push(val)
            } else {
                obj[key] = [val]
            }

            return obj
        },
        {}
    )
}

module.exports.zipToObjectWithArrays = zipToObjectWithArrays
