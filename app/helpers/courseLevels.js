import {curry, filter} from 'lodash'

let coursesAtOrAboveLevel = curry((level, course) => {
	return course.level >= level
})

let onlyCoursesAtOrAboveLevel = curry((level, courses) => {
	return filter(courses, coursesAtOrAboveLevel(level))
})

let coursesAtLevel = curry((level, course) => {
	return course.level === level
})

let onlyCoursesAtLevel = curry((level, courses) => {
	return filter(courses, coursesAtLevel(level))
})

let coursesAboveNumber = curry((number, course) => {
	return course.num > number
})

let onlyCoursesAboveNumber = curry((level, courses) => {
	return filter(courses, coursesAboveNumber(level))
})

export {
	coursesAtOrAboveLevel,
	onlyCoursesAtOrAboveLevel,
	coursesAtLevel,
	onlyCoursesAtLevel,
	coursesAboveNumber,
	onlyCoursesAboveNumber
}
