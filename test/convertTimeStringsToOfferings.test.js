// test/convertTimeStringsToOfferings.test.js
import convertTimeStringsToOfferings from '../lib/convertTimeStringsToOfferings'

describe('convertTimeStringsToOfferings', () => {
	it('turns the timestrings into semi-usable objects', () => {
		let course = {times: ['MT 0100-0400PM', 'MF 0905-1000']}

		let result = [
			{day: 'Mo', times: [{start:1300, end:1600}, {start:905, end:1000}]},
			{day: 'Tu', times: [{start:1300, end:1600}]},
			{day: 'Fr', times: [{start:905,  end:1000}]},
		]

		convertTimeStringsToOfferings(course).should.eql(result)
	})

	it('correctly joins different times on the same day', () => {
		let course = {times: ['M-Th 0100-0200PM', 'MF 0905-1000']}

		let result = [
			{day: 'Mo', times: [{start:1300, end:1400}, {start:905, end:1000}]},
			{day: 'Tu', times: [{start:1300, end:1400}]},
			{day: 'We', times: [{start:1300, end:1400}]},
			{day: 'Th', times: [{start:1300, end:1400}]},
			{day: 'Fr', times: [{start:905,  end:1000}]},
		]

		convertTimeStringsToOfferings(course).should.eql(result)
	})
})
