var _ = require('lodash')

function makeCourseObjects(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for 
	// those clbids.

	console.log('called makeCourseObjects with', clbids)
	return _.map(clbids, function(clbid) {
		var course;

		return {clbid: clbid}
		// getCourse(clbid).then(
		// 	function(data) { 
		// 		course = data
		// 	}
		// )
		// 
		// return course;
	})
}

module.exports = makeCourseObjects
