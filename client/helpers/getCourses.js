var _ = require('lodash')
var Promise = require("bluebird")

var time = require('../helpers/time')

window.courseCache = {}

function getCourse(clbid) {
	return new Promise(function(resolve, reject) {
		if (_.contains(_.keys(window.courseCache), String(clbid))) {
			console.log('course cached:', clbid)
			resolve(window.courseCache[clbid])
		} else {
			window.server.courses.get(clbid)
				.then(function(course) {
					if (course) {
						course = time.convertTimeStringsToOfferings(course)
						console.log('course retrieved:', course)
						window.courseCache[clbid] = course
						resolve(course)
					} else {
						console.error('course retrieval failed for: ' + clbid)
						reject(new Error('course retrieval failed for: ' + clbid))
					}
				})
		}
	})
}

function getCourses(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for 
	// those clbids.

	console.log('called getCourses with', clbids)
	return Promise.all(_.map(clbids, getCourse))
}

module.exports.getCourses = getCourses
module.exports.getCourse = getCourse
