var _ = require('lodash')

var coursesAtOrAboveLevel = _.curry(function(level, course) {
	return course.level >= level
})

var onlyCoursesAtOrAboveLevel = _.curry(function(level, courses) {
	return _.filter(courses, coursesAtOrAboveLevel(level))
})

var coursesAtLevel = _.curry(function(level, course) {
	return course.level === level
})

var onlyCoursesAtLevel = _.curry(function(level, courses) {
	return _.filter(courses, coursesAtLevel(level))
})

module.exports.coursesAtOrAboveLevel = coursesAtOrAboveLevel
module.exports.onlyCoursesAtOrAboveLevel = onlyCoursesAtOrAboveLevel
module.exports.coursesAtLevel = coursesAtLevel
module.exports.onlyCoursesAtLevel = onlyCoursesAtLevel
