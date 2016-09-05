import {shrinkDepartment} from 'hanson-format/convert-department'

// Builds a course identifier ("CSCI 121", "AS/RE 230B") from a course.
// TODO: update for new course format
export default function buildCourseIdent({depts, num, sect='', deptnum}) {
	let deptString = 'UNKN'
	if (depts) {
		deptString = depts.length > 1
			? depts.map(shrinkDepartment).join('/')
			: depts[0]
	}

	deptnum = deptnum || `${deptString} ${num}`
	return `${deptnum}${sect}`
}
