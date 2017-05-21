'use strict'

const { getStudentInfo } = require('./get-student-info')
const { checkIfLoggedIn } = require('./logged-in')
const { ExtensionNotLoadedError, ExtensionTooOldError } = require('./lib')

module.exports = {
    getStudentInfo,
    checkIfLoggedIn,
    ExtensionNotLoadedError,
    ExtensionTooOldError,
}
