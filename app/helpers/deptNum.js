'use strict';

import * as _ from 'lodash'
import hasDepartment from './hasDepartment'

function splitDeptNum(deptNumString) {
	// "AS/RE 230A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]
	// -> {depts: ['AS', 'RE'], num: 230}
	var combined = deptNumString.toUpperCase()
	var regex = /(([A-Z]+)(?=\/)(?:\/)([A-Z]+)|[A-Z]+) *([0-9]+) *([A-Z]?)/gi
	var matches = regex.exec(combined)

	return {
		depts: _.contains(matches[1], '/') ? [matches[2], matches[3]] : [matches[1]],
		num: parseInt(matches[4], 10)
	}
}

function buildDeptNum(course) {
	return course.depts.join('/') + ' ' + course.num
}

function hasDeptNumBetween(args, course) {
	var dept = args.dept
	var start = args.start
	var end = args.end

	if (_.any([dept, start, end], _.isUndefined)) {
		return false
	}

	return _.all([
		hasDepartment(dept, course),
		course.num >= start,
		course.num <= end
	])
}

export {
	splitDeptNum,
	buildDeptNum,
	hasDeptNumBetween
}
