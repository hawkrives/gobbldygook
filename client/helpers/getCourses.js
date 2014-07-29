var _ = require('lodash')
var Promise = require('bluebird')
var courses = require('../helpers/db').courses

var convertTimeStringsToOfferings = require('./time').convertTimeStringsToOfferings

// window.courseCache = {}

function getCourse(clbid) {
	return new Promise(function(resolve, reject) {
		courses.get(clbid, function(err, course) {
			if (err) {
				console.warn('course retrieval failed for: ' + clbid)
				reject(new Error('course retrieval (v1) failed for: ' + clbid))
			}

			if (course) {
				course = convertTimeStringsToOfferings(course)
				window.courseCache[clbid] = course
				resolve(course)
			}
			else {
				reject(new Error('course retrieval (v2) failed for: ' + clbid))
			}
		})
	}).done()
}

function getCourses(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for
	// those clbids.

	console.log('called getCourses with', clbids)
	return Promise.all(_.map(clbids, getCourse))
}

function getCourseFromDeptNum(deptNumString) {
	// Filter to only those with matching dept strings
	return window.db.courses
		.query('deptnum')
		.only(deptNumString)
		.filter('type', 'Research')
		.limit(1)
		.execute()
		.then(function(courses) {
			return courses[0]
		})
}

function checkCoursesForDeptNum(deptNumString, courses) {
	var crsidsToCheckAgainst = _.chain(courses).pluck('crsid').uniq().value()

	return getCourseFromDeptNum(deptNumString)
		.then(function(course) {
			if (course) {
				console.log(
					'checkCoursesForDeptNum',
					'checking for', course.crsid, 'in', crsidsToCheckAgainst,
					'result', _.contains(crsidsToCheckAgainst, course.crsid))
				return _.contains(crsidsToCheckAgainst, course.crsid)
			}
		}).catch(function(err) {
			console.error('checkCoursesForDeptNum error', err.stack)
		})
}

module.exports.getCourses = getCourses
module.exports.getCourse = getCourse

module.exports.getCourseFromDeptNum = getCourseFromDeptNum
module.exports.checkCoursesForDeptNum = checkCoursesForDeptNum

window.getCourses = module.exports
