import {expect} from 'chai'
import compareCourseToCourse from '../../src/area-tools/compare-course-to-course'

describe('compareCourseToCourse', () => {
	it('compares select keys of courses', () => {
		expect(compareCourseToCourse({department: ['ART'], number: 310}, {department: ['ART'], number: 310}))
			.to.be.true
	})

	it('compares empty objects to be equal', () => {
		expect(compareCourseToCourse({}, {})).to.be.true
	})

	describe('compares the "department" prop', () => {
		it('the same department is equal to itself', () => {
			expect(compareCourseToCourse({department: ['ART']}, {department: ['ART']}))
				.to.be.true
		})

		it('multiple departments are not the same as a single department', () => {
			expect(compareCourseToCourse({department: ['ART']}, {department: ['ART', 'ASIAN']}))
				.to.be.false
		})

		it('different departments are not equal', () => {
			expect(compareCourseToCourse({department: ['ASIAN']}, {department: ['ART']}))
				.to.be.false
		})

		it('order is significant', () => {
			expect(compareCourseToCourse({department: ['CHEM', 'BIO']}, {department: ['BIO', 'CHEM']}))
				.to.be.false
		})
	})

	describe('compares the "semester" prop', () => {
		it('and the same semester is equal to itself', () => {
			expect(compareCourseToCourse({semester: 1}, {semester: 1})).to.be.true
		})

		it('and different semesters are not equal', () => {
			expect(compareCourseToCourse({semester: 2}, {semester: 1})).to.be.false
		})

		it('and supports the wildcard selector', () => {
			expect(compareCourseToCourse({semester: '*'}, {semester: 1})).to.be.true
		})
	})

	describe('compares the "year" prop', () => {
		it('and the same year is equal to itself', () => {
			expect(compareCourseToCourse({year: 2014}, {year: 2014})).to.be.true
		})

		it('and different years are not equal', () => {
			expect(compareCourseToCourse({year: 2014}, {year: 2015})).to.be.false
		})

		it('and supports the wildcard selector', () => {
			expect(compareCourseToCourse({year: '*'}, {year: 2015})).to.be.true
		})
	})

	describe('compares the "number" prop', () => {
		it('the same number is equal to itself', () => {
			expect(compareCourseToCourse({number: 201}, {number: 201})).to.be.true
		})
		it('zero is equal', () => {
			expect(compareCourseToCourse({number: 0}, {number: 0})).to.be.true
		})
		it('zero equals negative zero', () => {
			expect(compareCourseToCourse({number: 0}, {number: -0})).to.be.true
		})
		it('zero is not one', () => {
			expect(compareCourseToCourse({number: 0}, {number: 1})).to.be.false
		})
		it('infinity is not negative infinity', () => {
			expect(compareCourseToCourse({number: Infinity}, {number: -Infinity})).to.be.false
		})
		it('infinity equals infinity', () => {
			expect(compareCourseToCourse({number: Infinity}, {number: Infinity})).to.be.true
		})
	})

	describe('compares the "level" prop', () => {
		it('the same level is equal to itself', () => {
			expect(compareCourseToCourse({level: 100}, {level: 100})).to.be.true
		})
		it('different levels are different', () => {
			expect(compareCourseToCourse({level: 100}, {level: 200})).to.be.false
		})
	})

	describe('compares the "international" prop', () => {
		it('the same "international" value is equal', () => {
			expect(compareCourseToCourse({international: true}, {international: true})).to.be.true
		})
		it('different values are different', () => {
			expect(compareCourseToCourse({international: true}, {international: false})).to.be.false
		})
	})

	describe('compares the "type" prop', () => {
		it('the same "type" value is equal', () => {
			expect(compareCourseToCourse({type: 'Lab'}, {type: 'Lab'})).to.be.true
		})
		it('different "type" values are different', () => {
			expect(compareCourseToCourse({type: 'Lab'}, {type: 'Research'})).to.be.false
		})
	})

	describe('compares the "section" prop', () => {
		it('and the same section is equal', () => {
			expect(compareCourseToCourse({section: 'A'}, {section: 'A'})).to.be.true
		})

		it('and different sections are different', () => {
			expect(compareCourseToCourse({section: 'A'}, {section: 'B'})).to.be.false
		})

		it('and supports the wildcard selector', () => {
			expect(compareCourseToCourse({section: '*'}, {section: 'D'})).to.be.true
		})
	})

	it('returns false if the query is more specific than the possibility', () => {
		expect(compareCourseToCourse({department: ['ASIAN'], number: 310, section: 'A'}, {department: ['ASIAN'], number: 310})).to.be.false
	})

	it('returns true if the query is less specific than the possibility', () => {
		expect(compareCourseToCourse({department: ['ASIAN'], number: 310}, {department: ['ASIAN'], number: 310, section: 'A'})).to.be.true
	})
})
