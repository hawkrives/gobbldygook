// test/convertTimeStringsToOfferings.test.js
import {expect} from 'chai'
import convertTimeStringsToOfferings from '../src/convertTimeStringsToOfferings'

describe('convertTimeStringsToOfferings', () => {
	it('turns the timestrings into semi-usable objects', () => {
		let course = {times: ['MT 0100-0400PM', 'MF 0905-1000']}

		let result = [
			{day: 'Mo', times: [{start:1300, end:1600}, {start:905, end:1000}]},
			{day: 'Tu', times: [{start:1300, end:1600}]},
			{day: 'Fr', times: [{start:905,  end:1000}]},
		]

		expect(convertTimeStringsToOfferings(course)).to.eql(result)
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

		expect(convertTimeStringsToOfferings(course)).to.eql(result)
	})

	it('does not return the same time object for different days', () => {
		let course = {times: ['MF 0905-1000']}

		let expected = [
			{day: 'Mo', times: [{start:905, end:1000}]},
			{day: 'Fr', times: [{start:905, end:1000}]},
		]

		let result = convertTimeStringsToOfferings(course)

		expect(result).to.deep.equal(expected)
		expect(result[0].times[0]).to.not.equal(result[1].times[0])
	})
})
