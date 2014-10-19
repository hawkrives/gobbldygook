'use strict';

import * as _ from 'lodash'

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

export {
	coursesAtOrAboveLevel,
	onlyCoursesAtOrAboveLevel,
	coursesAtLevel,
	onlyCoursesAtLevel
}
