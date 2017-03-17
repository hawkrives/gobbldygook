// @flow
'use strict'

function findMissingNumber(arr: number[]): ?number {
    if (arr.length === 0) {
        return null
    }

    if (arr.length === 1) {
        return null
    }

    let last = arr[0]
    for (const val of arr) {
        if (val > last + 1) {
            return last + 1
        }
        last = val
    }

    return null
}

module.exports.findMissingNumber = findMissingNumber
