var _ = require('lodash')
var Promise = require("bluebird")

function getCourse(clbid) {
	return new Promise(function(resolve, reject) {
		window.server[item.type].query('clbid', clbid)
			.execute()
			.done(function(result) {
				if (result.length > 0)
					resolve(result[0])
				else
					reject(result)
			})
	})
}

function makeCourseObjects(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for 
	// those clbids.

	console.log('called makeCourseObjects with', clbids)
	return new Promise.all(_.map(clbids, function(clbid) {
		var course;

		// return {clbid: clbid, credits: 1}
		getCourse(clbid).then(
			function(data) {
				course = data
			}
		)

		return course;
	}))
}

module.exports = makeCourseObjects
