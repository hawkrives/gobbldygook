import * as _ from 'lodash'

function onlyQuarterCreditCoursesCanBePassFail(course) {
	// NOTE: Because we can't check this (don't know p/f data), we return true
	// for everything.
	return true
}

let hasGenEd = _.curry(function(gened, course) {
	return _.contains(course.gereqs, gened)
})

let hasFOL = function(course) {
	return _.any(course.gereqs,
		req => req.substr(0,3) === 'FOL')
}

function countGeneds(courses, gened) {
	let uniqed = _.uniq(courses, 'crsid')

	if (gened === 'FOL')
		return _.size(_.filter(uniqed, hasFOL))

	return _.size(_.filter(uniqed, hasGenEd(gened)))
}

function getDepartments(courses) {
	return _.chain(courses).pluck('depts').flatten().uniq().value()
}

function acrossAtLeastTwoDepartments(courses) {
	let depts = getDepartments(courses)

	return _.size(depts) >= 2
}

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
