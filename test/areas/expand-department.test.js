import {expect} from 'chai'
import {expandDepartment} from '../../src/area-tools/convert-department'

describe('expandDepartment', () => {
	it('expands a short department abbreviation into a long abbreviation', () => {
		expect(expandDepartment('AS')).to.equal('ASIAN')
	})

	it('throws an error when a department is unknown', () => {
		expect(() => expandDepartment('HUMONGOUS')).to.throw(TypeError)
	})
})
