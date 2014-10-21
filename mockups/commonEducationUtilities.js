'use strict';

import * as _ from 'lodash'

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

export {
	onlyQuarterCreditCoursesCanBePassFail,
	hasGenEd,
	countGeneds
}
