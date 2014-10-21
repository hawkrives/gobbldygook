let _ = require('lodash')

let terms = [20131, 20132, 20133, 20141, 20142, 20143]
let courses = _.chain(terms)
	.map(term => '../data/courses/terms/' + term + '.json')
	.map(require)
	.map(term => term.courses)
	.flatten()
	.map(function(course) {
		course.deptnum = course.depts.join('/') + ' ' + course.num
		return course
	})
	.value()

module.exports = courses
