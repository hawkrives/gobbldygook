// @flow
import {expect} from 'chai'
import pluralizeArea from '../pluralize-area'

describe('pluralizeArea', () => {
	it('pluralizes degree to degrees', () => {
		expect(pluralizeArea('degree')).to.equal('degrees')
	})

	it('pluralizes major to majors', () => {
		expect(pluralizeArea('major')).to.equal('majors')
	})

	it('pluralizes concentration to concentrations', () => {
		expect(pluralizeArea('concentration')).to.equal('concentrations')
	})

	it('pluralizes emphasis to emphases', () => {
		expect(pluralizeArea('emphasis')).to.equal('emphases')
	})
})
