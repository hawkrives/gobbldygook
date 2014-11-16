let _ = require('lodash')
let checkMajor = require('../mockups/chemistry')
let courses = require('./helpers/data.js')

let log = thing => console.log(thing ? thing : arguments)

let student = {
	"schedules": {
		"1": {
			"id": 1, "year": 2012, "semester": 1,
			"title": "Schedule 1", "index": 1,
			"clbids": [88653, 89542, 91625],
			"active": true,
		}
	}
}

student.courses = _.chain(_.clone(student.schedules))
	.toArray()
	.pluck('clbids')
	.flatten()
	.uniq()
	.map(clbid => _.find(courses, {clbid: clbid}))
	.compact()
	.value()

// console.log(_.size(courses))
// checkMajor(student).then(log)
