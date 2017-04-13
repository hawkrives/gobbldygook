'use strict'
const stringify = require('stabilize')
const omit = require('lodash/omit')
const mapValues = require('lodash/mapValues')

module.exports.prepareStudentForSave = prepareStudentForSave
function prepareStudentForSave(student) {
    student = Object.assign({}, student)
    student = omit(student, ['areas', 'canGraduate', 'fulfilled'])
    student.schedules = mapValues(student.schedules, s =>
        omit(s, ['courses', 'conflicts', 'hasConflict'])
    )
    return student
}

module.exports.encodeStudent = encodeStudent
function encodeStudent(student) {
    return encodeURIComponent(stringify(prepareStudentForSave(student)))
}
