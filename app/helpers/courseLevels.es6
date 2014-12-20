import * as _ from 'lodash'

var coursesAtOrAboveLevel = _.curry((level, course) => {
	return course.level >= level
})

var onlyCoursesAtOrAboveLevel = _.curry((level, courses) => {
	return _.filter(courses, coursesAtOrAboveLevel(level))
})

var coursesAtLevel = _.curry((level, course) => {
	return course.level === level
})

var onlyCoursesAtLevel = _.curry((level, courses) => {
	return _.filter(courses, coursesAtLevel(level))
})

var coursesAboveNumber = _.curry((number, course) => {
	return course.num > number
})

var onlyCoursesAboveNumber = _.curry((level, courses) => {
	return _.filter(courses, coursesAboveNumber(level))
})

export {
	coursesAtOrAboveLevel,
	onlyCoursesAtOrAboveLevel,
	coursesAtLevel,
	onlyCoursesAtLevel,
	coursesAboveNumber,
	onlyCoursesAboveNumber
}
