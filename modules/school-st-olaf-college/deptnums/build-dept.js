// @flow
'use strict'

const {
    normalizeDepartment,
} = require('../../hanson-format/convert-department')

/**
 * Builds a department string from a course.
 *
 *    AS/RE => ASIAN/REL
 *    ASIAN/REL => ASIAN/REL
 *    ASIAN/RELIGION => ASIAN/REL
 *
 * @param {String[]} departments - the course departments
 * @returns {String} - the department string
 */
function buildDeptString(departments: string[]) {
    if (!departments || !departments.length) {
        return 'NONE'
    }

    return departments.map(normalizeDepartment).join('/')
}

module.exports.buildDeptString = buildDeptString
