import {normalizeDepartment} from '../stolaf-courses'

// Builds a course identifier ("CSCI 121", "AS/RE 230B") from a course.
// TODO: update for new course format
export default function buildCourseIdent({depts, num, sect='', deptnum}) {
	let deptString = 'UNKN'
	if (depts) {
		deptString = depts.map(normalizeDepartment).join('/')
	}

	deptnum = deptnum || `${deptString} ${num}`
	return `${deptnum}${sect}`
}
