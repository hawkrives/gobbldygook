import {expect} from 'chai'
import semesterName from '../../src/helpers/semester-name'

describe('semesterName', () => {
	it('converts a semester number to a semester name', () => {
		expect(semesterName(0)).to.equal('Abroad')
		expect(semesterName(1)).to.equal('Fall')
		expect(semesterName(2)).to.equal('Interim')
		expect(semesterName(3)).to.equal('Spring')
		expect(semesterName(4)).to.equal('Summer Session 1')
		expect(semesterName(5)).to.equal('Summer Session 2')
		expect(semesterName(6)).to.equal('Unknown (6)')
		expect(semesterName(9)).to.equal('Non-St. Olaf')
	})
})
