import { expect } from 'chai'
import simplifyCourse from '../simplify-course'

describe('simplifyCourse', () => {
	it('only uses department, number, and type', () => {
		expect(simplifyCourse({ department: [ 'CSCI' ], number: 121, year: 2014, type: 'Research' }))
			.to.equal('CSCI 121 Research')
	})

	it('joins multiple departments with a slash', () => {
		expect(simplifyCourse({ department: [ 'AS', 'RE' ], number: 121, type: 'Research' }))
			.to.equal('AS/RE 121 Research')
	})

	it('re-sorts departments', () => {
		expect(simplifyCourse({ department: [ 'CH', 'BI' ], number: 121, type: 'Research' }))
			.to.equal('BI/CH 121 Research')
	})

	it('adds a distinguishing symbol to FLAC courses', () => {
		expect(simplifyCourse({ department: [ 'CH', 'BI' ], number: 121, type: 'FLAC' }))
			.to.equal('BI/CH 121 FLAC')
	})
})
