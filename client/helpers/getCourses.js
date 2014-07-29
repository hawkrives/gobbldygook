var _ = require('lodash')
var Promise = require('bluebird')
var db = require('./db')

var convertTimeStringsToOfferings = require('./time').convertTimeStringsToOfferings

// window.courseCache = {}

function getCourse(clbid) {
	return window.db.courses
		.query('clbid')
		.only(clbid)
		.limit(1)
		.execute()
		.then(function(courses) {
			var course = courses[0]
			course = convertTimeStringsToOfferings(course)
			return course
		}).catch(function(records, err) {
			console.warn('course retrieval failed for: ' + clbid, arguments)
		})
}

function getCourses(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for
	// those clbids.

	console.log('called getCourses with', clbids)
	return Promise.all(_.map(clbids, getCourse))
}

function deptNumToCrsid(deptNumString) {
	return new Promise(function(resolve, reject) {
		// Filter to only those with matching dept strings
		window.db.courses
			.query('deptnum')
			.only(deptNumString)
			.limit(1)
			.execute()
			.then(function(courses) {
				if (_.size(courses)) {
					resolve(courses[0].crsid)
				}
				reject(new Error('Course ' + deptNumString + ' was not found'))
			})
	})
}

function logResult(result) {
	console.log(result)
}

function checkCoursesForDeptNum(deptNumString, courses) {
	var crsidsToCheckAgainst = _.chain(courses).pluck('crsid').uniq().value()

	return deptNumToCrsid(deptNumString)
		.then(function(crsid) {
			console.log(
				'checkCoursesForDeptNum',
				'checking for', crsid, 'in', crsidsToCheckAgainst,
				'result', _.contains(crsidsToCheckAgainst, crsid))
			return _.contains(crsidsToCheckAgainst, crsid)
		}).catch(function(err) {
			console.error('checkCoursesForDeptNum error', err.stack)
		})
}

module.exports.getCourses = getCourses
module.exports.getCourse = getCourse
module.exports.logResult = logResult

module.exports.deptNumToCrsid = deptNumToCrsid
module.exports.checkCoursesForDeptNum = checkCoursesForDeptNum

window.getCourses = module.exports
