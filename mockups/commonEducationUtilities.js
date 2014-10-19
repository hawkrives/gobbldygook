'use strict';

let _ = require('lodash')
let Promise = require('bluebird')

function onlyQuarterCreditCoursesCanBePassFail(course) {
	// NOTE: Because we can't check this (don't know p/f data), we return true
	// for everything.
	return true
}

var hasGenEd = _.curry(function(gened, course) {
	return _.contains(course.geneds, gened)
})

function countGeneds(courses, gened) {
	return _.size(_.filter(courses, hasGenEd(gened)))
}

module.exports.onlyQuarterCreditCoursesCanBePassFail = onlyQuarterCreditCoursesCanBePassFail
module.exports.hasGenEd = hasGenEd
module.exports.countGeneds = countGeneds
