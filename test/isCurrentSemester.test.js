// tests/isCurrentSemester.test.js
import {isCurrentSemester} from 'app/helpers/isCurrent'

describe('isCurrentSemester', () => {
	it('checks if a schedule is in the given semester', () => {
		isCurrentSemester(2012, 2, {year: 2012, semester: 2}).should.be.true
	})
})
