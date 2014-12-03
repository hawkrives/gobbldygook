'use strict';

import * as _ from 'lodash'
import hasDepartment from './hasDepartment.es6'

function splitDeptNum(deptNumString) {
	// "AS/RE 230A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]
	// -> {depts: ['AS', 'RE'], num: 230}
	let combined = deptNumString.toUpperCase()
	let regex = /(([A-Z]+)(?=\/)(?:\/)([A-Z]+)|[A-Z]+) *([0-9]+) *([A-Z]?)/gi
	let matches = regex.exec(combined)

	return {
		depts: _.contains(matches[1], '/') ? [matches[2], matches[3]] : [matches[1]],
		num: parseInt(matches[4], 10)
	}
}

function buildDept(course) {
	return course.depts.join('/')
}

function buildDeptNum(course) {
	return `${course.depts.join('/')} ${course.num}`
}

let hasDeptNumBetween = _.curry(function(args, course) {
	let dept = args.dept
	let start = args.start
	let end = args.end

	if (_.any([dept, start, end], _.isUndefined)) {
		return false
	}

	return _.all([
		hasDepartment(dept, course),
		course.num >= start,
		course.num <= end
	])
})

export {
	splitDeptNum,
	buildDept,
	buildDeptNum,
	hasDeptNumBetween
}
