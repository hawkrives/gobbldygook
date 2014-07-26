var _ = require('lodash')
var Promise = require("bluebird")

function getCourse(clbid) {
	return new Promise(function(resolve, reject) {
		window.server.courses.get(clbid)
			.then(function(course) {
				if (course) {
					console.log('course retrieved:', course)
					resolve(course)
				} else {
					console.error('course retrieval failed for: ' + clbid)
					reject(new Error('course retrieval failed for: ' + clbid))
				}
			})
	})
}

function getCourses(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for 
	// those clbids.

	console.log('called getCourses with', clbids)
	return Promise.all(_.map(clbids, function(clbid) {
		return new Promise(function(resolve, reject) {})
		var course;

		getCourse(clbid).then(
			function(data) {
				course = data
			}
		)

		return course;
	}))
}

module.exports.getCourses = getCourses
module.exports.getCourse = getCourse
