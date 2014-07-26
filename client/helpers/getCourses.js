var _ = require('lodash')
var Promise = require("bluebird")

function getCourse(clbid) {
	return new Promise(function(resolve, reject) {
		window.server.courses.get(clbid)
			.execute()
			.done(function(results) {
				console.log('courses retrieved:', results)
				if (results.length)
					resolve(results[0])
				else
					reject(results)
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
