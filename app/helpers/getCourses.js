'use strict';

import * as _ from 'lodash'
import * as Promise from 'bluebird'
import db from './db'

import {convertTimeStringsToOfferings} from './time'

var deptNumToCrsidCache = {}

function getCourse(clbid) {
	return db.store('courses')
		.get(clbid)
		.then(function(course) {
			course = convertTimeStringsToOfferings(course)
			return course
		}).catch(function(records, err) {
			console.warn('course retrieval failed for: ' + clbid, arguments)
		})
}

function getCourses(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for
	// those clbids.

	// console.log('called getCourses with', clbids)
	return Promise.all(_.map(clbids, getCourse))
}

function deptNumToCrsid(deptNumString) {
	return new Promise(function(resolve, reject) {
		if (deptNumToCrsidCache[deptNumString]) {
			resolve(deptNumToCrsidCache[deptNumString])
		} else {
			// Filter to only those with matching dept strings
			db.store('courses')
				.index('deptnum')
				.get(deptNumString)
				.then(function(courses) {
					if (_.size(courses) > 0) {
						resolve(courses[0].crsid)
					}
					reject(new Error('Course ' + deptNumString + ' was not found'))
				})
		}
	})
}

function checkCoursesForDeptNum(courses, deptNumString) {
	var crsidsToCheckAgainst = _.chain(courses).pluck('crsid').uniq().value()

	return deptNumToCrsid(deptNumString)
		.then(function(crsid) {
			return _.contains(crsidsToCheckAgainst, crsid)
		}).catch(function(err) {
			console.error('checkCoursesForDeptNum error', err.stack)
		})
}

export {
	getCourses,
	getCourse,

	deptNumToCrsidCache,
	deptNumToCrsid,
	checkCoursesForDeptNum
}

window.getCourses = {
	getCourses: getCourses,
	getCourse: getCourse,

	deptNumToCrsidCache: deptNumToCrsidCache,
	deptNumToCrsid: deptNumToCrsid,
	checkCoursesForDeptNum: checkCoursesForDeptNum,
}
