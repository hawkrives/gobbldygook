'use strict';

import * as _ from 'lodash'
import {courseCache} from './db'
import buildQueryFromString from './queryStuff'

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

// 'dept: Computer Science  dept: Asian Studies  name: Parallel  level: 300  year: $OR year:2013 year: 2014'
// { depts: [ '$AND', 'CSCI', 'ASIAN' ],
//   title: [ 'Parallel' ],
//   level: [ 300 ],
//   year: [ '$OR', 2013, 2014 ] }

// 'dept: ASIAN  Dept: Religion  title: "Japan*"  LEVEL: 200  year: 2014  semester: $OR  semester: 3  semester: 1'
// { depts: [ '$AND', 'ASIAN', 'REL' ],
//   title: [ '"Japan*"' ],
//   level: [ 200 ],
//   year: [ 2014 ],
//   semester: [ '$OR', 3, 1 ] }

// 'department: American Conversations  name: Independence  year: 2014  time: Tuesdays after 12'
// { depts: [ 'AMCON' ],
//   title: [ 'Independence' ],
//   year: [ 2014 ],
//   time: [ 'Tuesdays after 12' ] }

// 'ges: $AND  geneds: history of western culture gened: HBS  semester: Spring  year: 2014'
// { geneds: [ '$AND', 'HWC', 'HBS' ],
//   semester: [ 3 ],
//   year: [ 2014 ] }

function queryCourses(queryString) {
	let query = buildQueryFromString(queryString)
	console.log('query:', query)
	var results = _(courseCache)
		.filter(course => {
			let matches = _.map(query, (values, key) => {
				let AND = false;
				let OR = false;
				let substring = false;

				// values is either:
				// - a 1-long array
				// - an $AND query
				// - an $OR query
				// - one of the above, but substring

				if (values[0] === '$OR') {
					OR = true
				} else if (values[0] === '$AND') {
					AND = true
				}

				if (AND || OR) {
					values = _.tail(values);
				}

				if (_.contains(['title', 'name', 'description', 'notes'], key)) {
					substring = true;
				}

				let internalMatches = _.map(values, (val) => {
					// dept, gereqs, etc.
					if (_.isArray(course[key]) || substring) {
						return _.contains(course[key].toLowerCase(), val.toLowerCase())
					}
					return course[key] === val;
				})

				return OR ? _.some(internalMatches) : _.all(internalMatches)
			})
			return _.all(matches)
		})
		.map(_.cloneDeep)
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
