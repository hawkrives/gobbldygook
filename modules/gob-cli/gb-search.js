'use strict'
const table = require('text-table')
const searchCourses = require('./lib/search-for-courses')

function printCourse(course) {
	const sect = course.section ? `[${course.section}]` : ''

	const type =
		course.type && course.type !== 'Research' ? ` (${course.type})` : ''

	const title =
		course.title && course.title !== course.name ? ` [${course.title}]` : ''

	return [
		`${course.year}.${course.semester}`,
		`${course.departments.join('/')} ${course.number}${sect}${type}`,
		`${course.name}${title}`,
	]
}

module.exports = function search(args = {}) {
	const {riddles, unique, sort} = args
	// check if data has been cached
	searchCourses({riddles, unique, sort}).then(filtered => {
		if (args.list) {
			console.log(table(filtered.map(printCourse)))
		} else {
			filtered.map(printCourse).forEach(console.log.bind(console))
		}
	})
}
