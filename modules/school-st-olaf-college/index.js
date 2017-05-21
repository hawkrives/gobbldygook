'use strict'

const { expandYear, semesterName, toPrettyTerm } = require('./course-info')

const {
    buildDeptString,
    buildDeptNum,
    deptNumRegex,
    quacksLikeDeptNum,
    splitDeptNum,
} = require('./deptnums')

const {
    convertStudent,
    getStudentInfo,
    checkIfLoggedIn,
    ExtensionNotLoadedError,
    ExtensionTooOldError,
} = require('./sis-parser')

module.exports = {
    expandYear,
    semesterName,
    toPrettyTerm,

    buildDeptString,
    buildDeptNum,
    deptNumRegex,
    quacksLikeDeptNum,
    splitDeptNum,

    convertStudent,
    getStudentInfo,
    checkIfLoggedIn,
    ExtensionNotLoadedError,
    ExtensionTooOldError,
}
