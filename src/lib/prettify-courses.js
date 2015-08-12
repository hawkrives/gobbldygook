import map from 'lodash/collection/map'
import unescapeAllValues from './unescape-all-values'

const COURSE_TYPES = {
	IN: 'International',
	SE: 'SE',
	PS: 'PS',
	AD: 'AD',
}

function expandCourseType(type) {
	if (COURSE_TYPES.hasOwnProperty(type)) {
		return COURSE_TYPES[type]
	}
	return type
}

export default function prettifyCourses(jsonCourses) {
	return map(jsonCourses, function(course) {
		delete course['&nbsp;']
		delete course.inst

		course.credits = parseFloat(course.credit.replace(/\((.*)\)/, '$1'))
		delete course.credit

		if (course['g.e.']) {
			course.gereqs = course['g.e.'].trim().split(' ')
		}
		delete course['g.e.']

		course.num = parseInt(course.no)
		delete course.no

		course.semester = parseInt(course.term)
		course.year = parseInt(course.year)
		course.term = parseInt(String(course.year) + String(course.semester))

		course.deptnum = course.dept + ' ' + course.num
		course.level = course.level * 100
		course.depts = course.dept.split('/')

		course.name = course.title.trim()
		delete course.title

		// status is In-Progress or blank
		delete course.sts

		course.type = expandCourseType(course.type)

		return unescapeAllValues(course)
	})
}
