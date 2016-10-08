import {shrinkDepartment} from 'modules/hanson-format'

// Builds a course identifier ("CSCI 121", "AS/RE 230B") from a course.
export function buildCourseIdent({departments, number, section='', deptnum}) {
	let deptString = 'UNKN'
	if (departments) {
		deptString = departments.length > 1
			? departments.map(shrinkDepartment).join('/')
			: departments[0]
	}

	deptnum = deptnum || `${deptString} ${number}`
	return `${deptnum}${section}`
}
