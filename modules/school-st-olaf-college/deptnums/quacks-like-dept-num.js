// @flow
'use strict'

const { deptNumRegex } = require('./dept-num-regex')

// Checks if a string looks like a deptnum.
function quacksLikeDeptNum(deptNumString: string) {
	return deptNumRegex.test(deptNumString)
}

module.exports.quacksLikeDeptNum = quacksLikeDeptNum
