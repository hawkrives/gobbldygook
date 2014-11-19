'use strict';

import * as _ from 'lodash'
import {courseCache} from './db.es6'
import buildQueryFromString from './queryStuff.es6'

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
				if (!_.has(course, key))
					return false;

				let substring = false;

				// values is either:
				// - a 1-long array
				// - an $AND, $OR, $NOT, or $XOR query
				// - one of the above, but substring

				let hasBool = _.indexOf(values[0], '$') === 0;
				let OR = values[0] === '$OR';
				let NOR = values[0] === '$NOR';
				let AND = values[0] === '$AND';
				let NOT = values[0] === '$NOT';
				let XOR = values[0] === '$XOR';

				if (hasBool) {
					// remove the first value from the array
					values = _.tail(values, 1);
				}

				if (_(['title', 'name', 'description', 'notes', 'profs', 'times', 'places']).contains(key)) {
					substring = true;
				}

				let internalMatches = _.map(values, (val) => {
					// dept, gereqs, etc.
					if (_.isArray(course[key]) && !substring) {
						return _(course[key]).contains(val)
					}
					else if (_.isArray(course[key]) && substring) {
						return _(course[key]).map(item => _.contains(item.toLowerCase(), val.toLowerCase())).any()
					}
					else if (substring) {
						return _.contains(course[key].toLowerCase(), val.toLowerCase())
					}
					return course[key] === val;
				})

				if (!hasBool)
					return _.all(internalMatches);

				let result = false;

				if (OR)   result = _.some(internalMatches);
				if (NOR)  result = !_.some(internalMatches);
				if (AND)  result = _.all(internalMatches);
				if (NOT)  result = !_.all(internalMatches);
				if (XOR)  result = _.compact(internalMatches).length === 1;

				return result
			})
			return _.all(matches)
		})
		.map(_.cloneDeep)
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
