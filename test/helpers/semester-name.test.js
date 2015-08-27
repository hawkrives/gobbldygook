import semesterName from '../../src/helpers/semester-name'

describe('semesterName', () => {
	it('converts a semester number to a semester name', () => {
		expect(semesterName(0)).to.equal('Unknown (0)')
		expect(semesterName(1)).to.equal('Fall')
		expect(semesterName(2)).to.equal('Interim')
		expect(semesterName(3)).to.equal('Spring')
		expect(semesterName(4)).to.equal('Early Summer')
		expect(semesterName(5)).to.equal('Late Summer')
		expect(semesterName(6)).to.equal('Unknown (6)')
	})
})
