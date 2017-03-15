// @flow
'use strict'

function stringifyError(
    err: any,
    filter?: Array<any> | ((key: any, value: any) => any),
    space?: string | number
) {
    let plainObject = {}
    Object.getOwnPropertyNames(err).forEach(key => {
        plainObject[key] = err[key]
    })
    return JSON.stringify(plainObject, filter, space)
}

module.exports.stringifyError = stringifyError
