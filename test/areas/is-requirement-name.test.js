import {expect} from 'chai'
import isRequirementName from '../../src/area-tools/is-requirement-name'

describe('isRequirementName checks if a string is a requirement name', () => {
	it('can contain hyphens', () => {
		expect(isRequirementName('BTS-B')).to.be.true
	})

	it('may be a single letter', () => {
		expect(isRequirementName('BTS-B')).to.be.true
	})

	it('may be a single number', () => {
		expect(isRequirementName('0')).to.be.true
	})

	it('may include spaces', () => {
		expect(isRequirementName('Studio Art')).to.be.true
	})

	it('mustn\'t begin with an underscore', () => {
		expect(isRequirementName('_A0')).to.be.false
	})

	it('must be one or more chars long', () => {
		expect(isRequirementName('')).to.be.false
	})
})
