import {expect} from 'chai'
import findAllAvailableYears from '../../src/helpers/find-all-available-years'

describe('findAllAvailableYears', () => {
	it('takes a list of schedules and finds the first open year', () => {
		const schedules = [
			{'id': 3, 'year': 2012},
			{'id': 6, 'year': 2013},
			{'id': 1, 'year': 2015},
		]

		expect(findAllAvailableYears(schedules)).to.deep.equal([2014])
	})

	it('accomodates a matriculation date before the schedules', () => {
		const schedules = [
			{'id': 3, 'year': 2014},
			{'id': 6, 'year': 2013},
			{'id': 1, 'year': 2015},
		]
		const matriculation = 2012

		expect(findAllAvailableYears(schedules, matriculation)).to.deep.equal([2012])
	})

	it('does not add the matriculation year if it is already in the list of schedules', () => {
		const schedules = [
			{'id': 3, 'year': 2014},
			{'id': 6, 'year': 2013},
			{'id': 1, 'year': 2015},
		]
		const matriculation = 2013

		expect(findAllAvailableYears(schedules, matriculation)).to.deep.equal([])
	})
})
