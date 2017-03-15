'use strict'

const { convertStudent } = require('./convert-imported-student')

const {
    getStudentInfo,
    checkIfLoggedIn,
    ExtensionNotLoadedError,
    ExtensionTooOldError,
} = require('./import-student')

module.exports = {
    convertStudent,

    getStudentInfo,
    checkIfLoggedIn,
    ExtensionNotLoadedError,
    ExtensionTooOldError,
}
