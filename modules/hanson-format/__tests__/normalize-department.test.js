// @flow
import {expect} from 'chai'
import {normalizeDepartment} from '../convert-department'

describe('normalizeDepartment', () => {
	it('expands a short department abbreviation into a long abbreviation', () => {
		expect(normalizeDepartment('AS')).to.equal('ASIAN')
	})

	it('returns the input when a department is unknown', () => {
		expect(normalizeDepartment('HUMONGOUS')).to.equal('HUMONGOUS')
	})
})
