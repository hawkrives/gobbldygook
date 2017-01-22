import table from 'text-table'
import searchCourses from './lib/search-for-courses'

function printCourse(course) {
	return [
		`${course.year}.${course.semester}`,
		`${course.departments.join('/')} ${course.number}${course.section ? `[${course.section}]` : ''}${course.type && course.type !== 'Research' ? ' (' + course.type + ')' : ''}`,
		`${course.name}${course.title && course.title !== course.name ? ` [${course.title}]` : ''}`,
	]
}

export default function search({riddles, unique, sort, ...opts}={}) {
	// check if data has been cached
	searchCourses({riddles, unique, sort}).then(filtered => {
		if (opts.list) {
			console.log(table(filtered.map(printCourse)))
		}
		else {
			filtered.map(printCourse).forEach(console.log.bind(console))
		}
	})
}
