var _ = require('lodash')

module.exports.coursesAtOrAboveLevel = _.curry(function(level, course) {
	return course.level >= level
})

module.exports.coursesAtLevel = _.curry(function(level, course) {
	return course.level === level
})
