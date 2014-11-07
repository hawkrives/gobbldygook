'use strict';

import * as _ from 'lodash'
import {courseCache} from './db'

function getCourse(clbid) {
	let course = courseCache[clbid]

	if (!course) {
		console.warn('course retrieval failed for: ' + clbid)
	}

	return _.cloneDeep(course)
}

function getCourses(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for
	// those clbids.
	return _.map(clbids, getCourse)
}

function deptNumToCrsid(deptNumString) {
	let result = _.find(courseCache.courses, {deptnum: deptNumString})
	if (result) {
		return result.crsid
	} else {
		console.warn('Course ' + deptNumString + ' was not found')
	}
}

function checkCoursesForDeptNum(courses, deptNumString) {
	var crsidsToCheckAgainst = _.chain(courses).pluck('crsid').uniq().value()

	let crsid = deptNumToCrsid(deptNumString)
	return _.contains(crsidsToCheckAgainst, crsid)
}

function checkCoursesFor(courses, filter) {
	return _.any(courses, filter)
}

////
// from queryCourses


'use strict';

// query = {
// 		'title': {values: ['Chinese'], flags: ['caseInsensitive', 'partialMatch']},
// 		'year': {values: [2009, 2010], bool: 'OR'},
// 		'level': {values: [200], flags: ['>=']},
// 		'type': {values: ['Lab', 'Research', 'Topic'], bool: 'NOT', flags: ['caseInsensitive']}
// }

function queryCourses(query) {
	query = query.toLowerCase()
	var results = _.chain(courseCache)
		.filter(course => _.contains(course.title.toLowerCase(), query))
		.sortBy('title')
		.groupBy('term')
		.value()
	return results
}


export {
	getCourse,
	getCourses,
	queryCourses,

	deptNumToCrsid,
	checkCoursesForDeptNum,
	checkCoursesFor
}

window.courses = {
	getCourse, getCourses,
	queryCourses,

	deptNumToCrsid,
	checkCoursesForDeptNum,
	checkCoursesFor,
}
