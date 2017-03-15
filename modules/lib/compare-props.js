// @flow
'use strict'
const every = require('lodash/every')

function compareProps(oldProps: Object, newProps: Object): boolean {
    return !every(oldProps, (_, key) => oldProps[key] === newProps[key])
}

module.exports.compareProps = compareProps
