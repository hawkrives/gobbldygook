// @flow
'use strict'
const sortBy = require('lodash/sortBy')

const types = ['degree', 'major', 'concentration', 'emphasis']
function sortStudiesByType(studies: Array<{type: string}>) {
    return sortBy(studies, s => types.indexOf(s.type))
}

module.exports.sortStudiesByType = sortStudiesByType
