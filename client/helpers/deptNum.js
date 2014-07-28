var _ = require('lodash')

var queryCourses = require('./queryCourses')

function buildDeptNum(deptNumString) {
	var combined = deptNumString.toUpperCase()
	var regex = /(([A-Z]+)(?=\/)(?:\/)([A-Z]+)|[A-Z]+) *([0-9]+) *([A-Z]?)/gi
	var match = regex.exec(combined)
	// "AS/RE 230A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]

	var result = {}
	result.dept = {values: _.contains(match[1], '/') ? [match[2], match[3]] : [match[1]]}
	result.num  = {values: [match[4]]}
	if (match[5]) {
		result.sect = {values: [match[5]]}
	}

	return result
}

function getCourseFromDeptNum(deptNumString) {
	var deptNum = buildDeptNum(deptNumString)
	return new Promise(function(resolve, reject) {
		window.server.courses.query('deptnum')
			.only('deptnum', deptNumString)
			.execute()
			.done(resolve)
	})
}

function checkCoursesForDeptNum(deptNumString, courses) {
	return new Promise(function(resolve, reject) {
		// console.log('checkCoursesForDeptNum', 'deptNum', deptNumString, 'courses', courses)
		var crsidsToCheckAgainst = _.chain(courses).pluck('crsid').uniq().value()

		getCourseFromDeptNum(deptNumString).then(function(crsidToCheckFor) {
			crsidToCheckFor = _.uniq(_.pluck(courses, 'crsid'))
			console.log('checkCoursesForDeptNum crsids', crsidToCheckFor, 'against', crsidsToCheckAgainst)
			resolve(_.contains(crsidsToCheckAgainst, crsidToCheckFor))
		})
	})
}

module.exports.buildDeptNum = buildDeptNum
module.exports.getCourseFromDeptNum = getCourseFromDeptNum
module.exports.checkCoursesForDeptNum = checkCoursesForDeptNum
