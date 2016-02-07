import {shrinkDepartment} from '../area-tools/convert-department'

// Builds a course identifier ("CSCI 121", "AS/RE 230B") from a course.
export default function courseIdent({depts, num, section='', deptnum}) {
	if (depts) {
		depts = depts.length > 1
			? depts.map(shrinkDepartment).join('/')
			: depts[0]
	}

	deptnum = deptnum || `${depts} ${num}`
	return `${deptnum}${section}`
}
