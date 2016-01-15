import test from 'ava'
import 'babel-core/register'
import checkCoursesForTimeConflicts from '../src/checkCoursesForTimeConflicts'
import convertTimeStringsToOfferings from '../src/convertTimeStringsToOfferings'

test('checkCoursesForTimeConflicts checks for course time conflicts', t => {
	let courses = [
		{offerings: [
			{day: 'Mo', times:[{start:1300, end:1600}, {start:905, end:1000}]},
			{day: 'Tu', times:[{start:1300, end:1600}]},
			{day: 'Fr', times:[{start:905, end:1000}]},
		]},
		{offerings: [
			{day: 'Mo', times:[{start:1300, end:1400}, {start:905, end:1000}]},
			{day: 'Tu', times:[{start:1300, end:1400}]},
			{day: 'We', times:[{start:1300, end:1400}]},
			{day: 'Th', times:[{start:1300, end:1400}]},
			{day: 'Fr', times:[{start:905, end:1000}]},
		]},
		{offerings: [
			{day: 'Mo', times:[{start:400, end:600}]},
		]},
	]

	t.true(checkCoursesForTimeConflicts(courses[0], courses[1]))

	t.false(checkCoursesForTimeConflicts(courses[0], courses[2]))
	t.false(checkCoursesForTimeConflicts(courses[1], courses[2]))
})

test('checkCoursesForTimeConflicts handles the output of convertTimeStringsToOfferings', t => {
	let testing = [
		{offerings: convertTimeStringsToOfferings({times: ['M 1255-0325PM']})},
		{offerings: convertTimeStringsToOfferings({times: ['MWF 0200-0255PM']})},
	]

	t.true(checkCoursesForTimeConflicts(testing[0], testing[1]))
	t.true(checkCoursesForTimeConflicts(testing[1], testing[0]))
})
