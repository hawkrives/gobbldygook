import * as _ from 'lodash'

import onlyQuarterCreditCoursesCanBePassFail from './onlyQuarterCreditCoursesCanBePassFail'
import hasFOL from './hasFOL'
import hasGenEd from './hasGenEd'
import countGeneds from './countGeneds'
import getDepartments from './getDepartments'
import acrossAtLeastTwoDepartments from './acrossAtLeastTwoDepartments'
import checkThatCoursesSpanDepartmentsAndGeneds from './checkThatCoursesSpanDepartmentsAndGeneds'

function isIntercollegiateSport(course) {
	// Only one SPM course credit may be earned by students as a result of
	// participation in an approved intercollegiate sport. This credit must be
	// entered as Exercise Science 171-194 at the registration preceding the
	// sport/participation term.
	const result = hasDeptNumBetween({dept: 'ESTH', start: 171, end: 194}, course)
	return result
}

export {
	onlyQuarterCreditCoursesCanBePassFail,
	hasGenEd,
	hasFOL,
	countGeneds,
	getDepartments,
	acrossAtLeastTwoDepartments,
	checkThatCoursesSpanDepartmentsAndGeneds,
	isIntercollegiateSport
}
