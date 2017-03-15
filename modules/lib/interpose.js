// @flow
'use strict'
const reduce = require('lodash/reduce')

function interpose<T, U>(data: T[], value: U): (T | U)[] {
    const len = data.length
    return reduce(data, (arr, item, index) => {
        if (index < len - 1) {
            return arr.concat(item, value)
        }
        return arr.concat(item)
    }, [])
}

module.exports.interpose = interpose
