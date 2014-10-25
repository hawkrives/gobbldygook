'use strict';

import * as _ from 'lodash'
import * as Promise from 'bluebird'
import {courseCache} from './db'

function getCourse(clbid) {
	let course = courseCache[clbid]

	if (!course) {
		console.warn('course retrieval failed for: ' + clbid)
	}

	return course
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

export {
	getCourse,
	getCourses,

	deptNumToCrsid,
	checkCoursesForDeptNum,
	checkCoursesFor
}

window.getCourses = {
	getCourse: getCourse,
	getCourses: getCourses,

	deptNumToCrsid: deptNumToCrsid,
	checkCoursesForDeptNum: checkCoursesForDeptNum,
	checkCoursesFor: checkCoursesFor,
}
