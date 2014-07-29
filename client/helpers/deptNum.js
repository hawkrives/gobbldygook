var _ = require('lodash')

var queryCourses = require('./queryCourses')

function splitDeptNum(deptNumString) {
	// "AS/RE 230A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]
	// -> {depts: ['AS', 'RE'], num: 230, sect: 'A'}
	var combined = deptNumString.toUpperCase()
	var regex = /(([A-Z]+)(?=\/)(?:\/)([A-Z]+)|[A-Z]+) *([0-9]+) *([A-Z]?)/gi
	var matches = regex.exec(combined)

	return {
		dept: _.contains(matches[1], '/') ? [matches[2], matches[3]] : [matches[1]],
		num: parseInt(matches[4], 10),
		sect: matches[5] || undefined
	}
}

function buildDeptNum(course) {
	return course.depts.join('/') + ' ' + course.num + (course.sect || '')
}

module.exports.splitDeptNum = splitDeptNum
module.exports.buildDeptNum = buildDeptNum
