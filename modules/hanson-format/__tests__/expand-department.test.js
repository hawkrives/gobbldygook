import {expect} from 'chai'
import {expandDepartment} from '../convert-department'

describe('expandDepartment', () => {
	it('expands a short department abbreviation into a long abbreviation', () => {
		expect(expandDepartment('AS')).to.equal('Asian Studies')
	})

	it('throws an error when a department is unknown', () => {
		expect(() => expandDepartment('HUMONGOUS')).to.throw(TypeError)
	})
})
