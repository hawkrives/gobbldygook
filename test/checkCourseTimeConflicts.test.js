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

		expect(checkCourseTimeConflicts(courses[0], courses[1])).to.be.true

		expect(checkCourseTimeConflicts(courses[0], courses[2])).to.be.false
		expect(checkCourseTimeConflicts(courses[1], courses[2])).to.be.false
	})

	it('handles the output of convertTimeStringsToOfferings', () => {
		let testing = [
			{offerings: convertTimeStringsToOfferings({times: ['M 1255-0325PM']})},
			{offerings: convertTimeStringsToOfferings({times: ['MWF 0200-0255PM']})},
		]

		expect(checkCourseTimeConflicts(testing[0], testing[1])).to.be.true
		expect(checkCourseTimeConflicts(testing[1], testing[0])).to.be.true
	})
})
