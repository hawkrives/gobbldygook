import * as _ from 'lodash'


function checkThatNCoursesSpanTwoDepartments(courses, geneds, genedToCheck, n=2) {
	// Input: courses-array of courses. geneds-['ALS-A', 'ALS-L']. genedToCheck-'ALS-A'
	// XXX,YYY - N courses, from different departments
	let coursesOne = _.filter(courses, hasGenEd(geneds[0]))
	let coursesTwo = _.filter(courses, hasGenEd(geneds[1]))

	let allCourses = _.uniq(coursesOne.concat(coursesTwo), 'crsid')
	let coversTwoDepartments = acrossAtLeastTwoDepartments(allCourses)

	return _.all([
		countGeneds(courses, genedToCheck) >= 1,
		_.size(allCourses) >= n,
		coversTwoDepartments,
	])
}
import onlyQuarterCreditCoursesCanBePassFail from './onlyQuarterCreditCoursesCanBePassFail'
import hasFOL from './hasFOL'
import hasGenEd from './hasGenEd'
import countGeneds from './countGeneds'
import getDepartments from './getDepartments'
import acrossAtLeastTwoDepartments from './acrossAtLeastTwoDepartments'

function isIntercollegiateSport(course) {
	// Only one SPM course credit may be earned by students as a result of
	// participation in an approved intercollegiate sport. This credit must be
	// entered as Exercise Science 171-194 at the registration preceding the
	// sport/participation term.
	let result = hasDeptNumBetween({dept: 'ESTH', start: 171, end: 194}, course)
	return result
}

export {
	onlyQuarterCreditCoursesCanBePassFail,
	hasGenEd,
	hasFOL,
	countGeneds,
	getDepartments,
	acrossAtLeastTwoDepartments,
	checkThatNCoursesSpanTwoDepartments,
	isIntercollegiateSport
}
