'use strict';

import * as _ from 'lodash'

var hasDepartment = _.curry(function(dept, course) {
	// _.curry allows the function to be called with arguments multiple times.
	return _.contains(course.depts, dept)
})

export default hasDepartment
