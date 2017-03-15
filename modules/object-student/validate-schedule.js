'use strict'
const { findWarnings } = require('./find-course-warnings')
const filter = require('lodash/filter')
const flatten = require('lodash/flatten')
const identity = require('lodash/identity')
const map = require('lodash/map')
const some = require('lodash/some')
const reject = require('lodash/reject')
const isUndefined = require('lodash/isUndefined')

function validateSchedule(schedule) {
    // Checks to see if the schedule is valid
    let courses = schedule.courses

    // only check the courses that have data
    courses = reject(courses, isUndefined)

    // Step one: do any times conflict?
    const conflicts = findWarnings(courses, schedule)

    const flattened = flatten(conflicts)
    const filtered = filter(flattened, identity)
    const warnings = map(filtered, c => c.warning)
    const hasConflict = some(warnings, w => w === true)

    return Object.assign({}, schedule, { hasConflict, conflicts })
}

module.exports.validateSchedule = validateSchedule
