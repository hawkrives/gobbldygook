import * as _ from 'lodash'

let coursesAtOrAboveLevel = _.curry((level, course) => {
	return course.level >= level
})

let onlyCoursesAtOrAboveLevel = _.curry((level, courses) => {
	return _.filter(courses, coursesAtOrAboveLevel(level))
})

let coursesAtLevel = _.curry((level, course) => {
	return course.level === level
})

let onlyCoursesAtLevel = _.curry((level, courses) => {
	return _.filter(courses, coursesAtLevel(level))
})

let coursesAboveNumber = _.curry((number, course) => {
	return course.num > number
})

let onlyCoursesAboveNumber = _.curry((level, courses) => {
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
