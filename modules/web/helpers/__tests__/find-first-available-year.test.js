import { expect } from 'chai'
import { findFirstAvailableYear } from '../find-first-available-year'

describe('findFirstAvailableYear', () => {
    it('takes a list of schedules and finds the first open year', () => {
        let schedules = [
			{ 'id': 3, 'year': 2012 },
			{ 'id': 6, 'year': 2013 },
			{ 'id': 1, 'year': 2015 },
        ]

        expect(findFirstAvailableYear(schedules)).to.equal(2014)
        expect(findFirstAvailableYear(schedules)).to.not.equal(2016)
    })

    it('accomodates a matriculation date before the schedules', () => {
        let schedules = [
			{ 'id': 3, 'year': 2014 },
			{ 'id': 6, 'year': 2013 },
			{ 'id': 1, 'year': 2015 },
        ]
        let matriculation = 2012

        expect(findFirstAvailableYear(schedules, matriculation)).to.equal(2012)
    })

    it('does not add the matriculation year if it is already in the list of schedules', () => {
        let schedules = [
			{ 'id': 3, 'year': 2014 },
			{ 'id': 6, 'year': 2013 },
			{ 'id': 1, 'year': 2015 },
        ]
        let matriculation = 2013

        expect(findFirstAvailableYear(schedules, matriculation)).to.equal(2016)
    })

    it('uses the current year as the matriculation year if not given, and no schedules available', () => {
        let expected = new Date().getFullYear()
        expect(findFirstAvailableYear([])).to.equal(expected)
    })
})
