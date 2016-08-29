import {expect} from 'chai'
import isCurrentSemester from '../../src/helpers/is-current-semester'

describe('isCurrentSemester', () => {
	it('checks if a schedule is in the given semester', () => {
		expect(isCurrentSemester(2012, 2)({year: 2012, semester: 2})).to.be.true
	})
})
