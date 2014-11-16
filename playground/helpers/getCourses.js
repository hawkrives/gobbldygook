let _ = require('lodash')
let courses = require('./data.js')
let Promise = require('bluebird')

function deptNumToCrsid(deptNumString) {
	return new Promise(function(resolve, reject) {
		let found = _.find(courses, {deptnum: deptNumString})
		if (found) {
			resolve(found.crsid)
		} else {
			console.error('"' + deptNumString + '"')
			reject(new Error('Course ' + deptNumString + ' was not found'))
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

function findCourseSequence(findObj) {
	let foundCourse = _.find(courses, findObj)
	if (foundCourse) {
		//// Example Titles:
		// Asian Conversations II: Experiencing Asia
		// Principles of Physics I

		let followedBySemicolon = /(IX|IV|V?I{0,3}):/
		let endOfLine           = /(IX|IV|V?I{0,3})$/
		let followedBySlash     = /(IX|IV|V?I{0,3})\//

		let str = foundCourse.title
		let semicolonMatch = str.match(followedBySemicolon)
		let eolMatch = str.match(endOfLine)
		let slashMatch = str.match(followedBySlash)

		let match = semicolonMatch || followedBySlash || eolMatch
		if (match) {
			let titularPrefix = str.substr(0, match.index).trim()
			console.log(match, titularPrefix)

			return _.chain(courses)
				.filter(course => course.title.substr(0, titularPrefix.length) === titularPrefix)
				.uniq('crsid')
				.value()
		}
	}
	return null
}

console.log(findCourseSequence({'deptnum': 'PHYS 125'}))
// console.log(_.find(courses, {deptnum: 'PHYS 125', type: 'Research'}))
module.exports.checkCoursesForDeptNum = checkCoursesForDeptNum
