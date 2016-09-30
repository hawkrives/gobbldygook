import {shrinkDepartment} from '../area-tools/convert-department'

// Builds a course identifier ("CSCI 121", "AS/RE 230B") from a course.
export default function courseIdent({depts, num, sect='', deptnum}) {
	let deptString = 'UNKN'
	if (depts) {
		deptString = depts.length > 1
			? depts.map(shrinkDepartment).join('/')
			: depts[0]
	}

	deptnum = deptnum || `${deptString} ${num}`
	return `${deptnum}${sect}`
}
