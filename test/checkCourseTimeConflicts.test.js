// test/checkCourseTimeConflicts.test.js
import checkCourseTimeConflicts from '../lib/checkCourseTimeConflicts'
import convertTimeStringsToOfferings from '../lib/convertTimeStringsToOfferings'

describe('checkCourseTimeConflicts', () => {
	it('checks for course time conflicts', () => {
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

		checkCourseTimeConflicts(courses[0], courses[1]).should.be.true

		checkCourseTimeConflicts(courses[0], courses[2]).should.be.false
		checkCourseTimeConflicts(courses[1], courses[2]).should.be.false
	})

	it('handles the output of convertTimeStringsToOfferings', () => {
		let testing = [
			{offerings: convertTimeStringsToOfferings({times: ['M 1255-0325PM']})},
			{offerings: convertTimeStringsToOfferings({times: ['MWF 0200-0255PM']})},
		]

		checkCourseTimeConflicts(testing[0], testing[1]).should.be.true
		checkCourseTimeConflicts(testing[1], testing[0]).should.be.true
	})
})
