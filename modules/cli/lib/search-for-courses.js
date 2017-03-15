'use strict'
const { tryReadJsonFile } = require('./read-file')

const flatten = require('lodash/flatten')
const filter = require('lodash/filter')
const forEach = require('lodash/forEach')
const uniqBy = require('lodash/uniqBy')
const isString = require('lodash/isString')
const sortBy = require('lodash/sortBy')
const map = require('lodash/map')

const { cacheDir } = require('./dirs')

const { checkForStaleData } = require('./update-local-data-cache')

const path = require('path')

const { quacksLikeDeptNum, splitDeptNum } = require('../../school-st-olaf-college')

const pify = require('pify')
const fs = pify(require('graceful-fs'))

function getDeptNumsFromRiddles(r) {
    if (isString(r) && quacksLikeDeptNum(r)) {
        return splitDeptNum(r)
    }
    return r
}

module.exports = async function search({ riddles, unique, sort }={}) {
	// check if data has been cached
    await checkForStaleData()

    let base = `${cacheDir}/Courses/`
    let courses = flatten(map(fs.readdirSync(base), fn => (tryReadJsonFile(path.join(base, fn)) || [])))

    riddles	= riddles.map(getDeptNumsFromRiddles)

    let filtered = courses
    forEach(riddles, riddle => {
        filtered = filter(filtered, riddle)
    })

    if (unique) {
        filtered = uniqBy(filtered, unique)
    }

    if (sort) {
        filtered = sortBy(filtered, flatten(sort))
    }

    return filtered
}
