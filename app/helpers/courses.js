import * as _ from 'lodash'
import * as Promise from 'bluebird'
import * as Immutable from 'immutable'

import db from 'app/helpers/db'
import buildQueryFromString from 'app/helpers/queryStuff'


/**
 * Gets a course from the database.
 *
 * @param {Number} clbid - a class/lab ID
 * @promise TreoDatabasePromise
 * @fulfill {Object} - the course object.
 * @reject {Error} - a message about retrieval failing.
 */
function getCourse(clbid) {
	// console.log('called getCourse', clbid)
	return db.store('courses')
		.get(clbid)
		.catch((err) => new Error(`course retrieval failed for ${clbid}`, err))
}


/**
 * Gets a list of course ids from the database.
 *
 * @param {Array|Immutable.List} clbids - a list of class/lab IDs
 * @promise BluebirdPromiseArray
 * @fulfill {Array} - the courses.
 */
function getCourses(clbids) {
	// Takes a list of clbids, and returns a list of the course objects for
	// those clbids.

	// console.log('called getCourses', clbids)
	if (Immutable.List.isList(clbids))
		clbids = clbids.toJS()

	return Promise.all(clbids.map(getCourse))
}


/**
 * Gets a course from the database by way of the deptnum string.
 *
 * @param {String} deptNumString - a deptnum string, like AS230.
 * @promise TreoDatabasePromise
 * @fulfill {Object} - the course object.
 * @reject {Error} - a message about retrieval failing.
 */
function deptNumToCrsid(deptNumString) {
	return db.store('courses')
		.index('deptnum')
		.get(deptNumString)
		.catch((err) => new Error(`Course ${deptNumString} was not found`, err))
}

function checkCoursesForDeptNum(courses, deptNumString) {
	let crsidsToCheckAgainst = _(courses).pluck('crsid').uniq().value()

	return deptNumToCrsid(deptNumString)
		.then((crsid) => _.contains(crsidsToCheckAgainst, crsid))
}

/**
 * Checks if any courses in a list of courses pass a given lodash filter.
 *
 * @param {Array} courses
 * @param {String|Object|Function} filter - any valid lodash filter
 * @returns {Boolean} - from _.any
 */
function checkCoursesFor(courses, filter) {
	return _.any(courses, filter)
}


/**
 * Queries the database for courses.
 *
 * @param {String} queryString
 * @returns {Array|Boolean}
 */
function queryCourses(queryString) {
	// Examples:

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

	let query = buildQueryFromString(queryString)

	console.log('query:', query)

	let results = _(courseCache)
		.filter(course => {
			let matches = _.map(query, (values, key) => {
				if (!_.has(course, key))
					return false

				let substring = false

				// values is either:
				// - a 1-long array
				// - an $AND, $OR, $NOT, or $XOR query
				// - one of the above, but substring

				let hasBool = _.indexOf(values[0], '$') === 0
				let OR = values[0] === '$OR'
				let NOR = values[0] === '$NOR'
				let AND = values[0] === '$AND'
				let NOT = values[0] === '$NOT'
				let XOR = values[0] === '$XOR'

				if (hasBool) {
					// remove the first value from the array
					values = _.tail(values, 1)
				}

				if (_(['title', 'name', 'description', 'notes', 'profs', 'times', 'places']).contains(key)) {
					substring = true
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
					return course[key] === val
				})

				if (!hasBool)
					return _.all(internalMatches)

				let result = false

				if (OR)   result = _.some(internalMatches)
				if (NOR)  result = !_.some(internalMatches)
				if (AND)  result = _.all(internalMatches)
				if (NOT)  result = !_.all(internalMatches)
				if (XOR)  result = _.compact(internalMatches).length === 1

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

window.courseStuff = {
	getCourse,
	getCourses,
	queryCourses,

	deptNumToCrsid,
	checkCoursesForDeptNum,
	checkCoursesFor,
}
