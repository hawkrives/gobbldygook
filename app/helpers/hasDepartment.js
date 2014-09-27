'use strict';

var _ = require('lodash')

var hasDepartment = _.curry(function(dept, course) {
	// _.curry allows the function to be called with arguments multiple times.
	return _.contains(course.depts, dept)
})

module.exports = hasDepartment
