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

module.exports.splitDeptNum = splitDeptNum
module.exports.buildDeptNum = buildDeptNum
module.exports.getCourseFromDeptNum = getCourseFromDeptNum
module.exports.checkCoursesForDeptNum = checkCoursesForDeptNum
