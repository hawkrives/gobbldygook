// tests/isCurrent-test.js
import 'should'

describe('isCurrentSemester', () => {
	it('checks if a schedule is in the given semester', () => {
		import {isCurrentSemester} from 'app/helpers/isCurrent'
		isCurrentSemester(2012, 2, {year: 2012, semester: 2}).should.be.true
	});
});

describe('isCurrentYear', () => {
	it('checks if a schedule is in the given year', () => {
		import {isCurrentYear} from 'app/helpers/isCurrent'
		isCurrentYear(2012, {year: 2012, semester: 2}).should.be.true
	});
});
