var _ = require('lodash')
var courses = require('./db').courses

var hasDepartment = require('./hasDepartment')

function splitDeptNum(deptNumString) {
	// "AS/RE 230A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]
	// -> {depts: ['AS', 'RE'], num: 230}
	var combined = deptNumString.toUpperCase()
	var regex = /(([A-Z]+)(?=\/)(?:\/)([A-Z]+)|[A-Z]+) *([0-9]+) *([A-Z]?)/gi
	var matches = regex.exec(combined)

	return {
		dept: _.contains(matches[1], '/') ? [matches[2], matches[3]] : [matches[1]],
		num: parseInt(matches[4], 10)
	}
}

function buildDeptNum(course) {
	return course.depts.join('/') + ' ' + course.num
}

function hasDeptNumBetween(args, course) {
	var dept = args.dept
	var start = args.start
	var end = args.end

	if (_.any([dept, start, end], _.isUndefined)) {
		return false
	}

	return _.all([
		hasDepartment(course, dept),
		dept.num >= start,
		dept.num <= end
	])
}

module.exports.splitDeptNum = splitDeptNum
module.exports.buildDeptNum = buildDeptNum
module.exports.hasDeptNumBetween = hasDeptNumBetween
