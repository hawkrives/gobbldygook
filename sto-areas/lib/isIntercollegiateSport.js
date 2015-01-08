import {hasDeptNumBetween} from 'app/helpers/deptNum'

function isIntercollegiateSport(course) {
	// Only one SPM course credit may be earned by students as a result of
	// participation in an approved intercollegiate sport. This credit must be
	// entered as Exercise Science 171-194 at the registration preceding the
	// sport/participation term.
	let result = hasDeptNumBetween({dept: 'ESTH', start: 171, end: 194}, course)
	return result
}

export default isIntercollegiateSport
