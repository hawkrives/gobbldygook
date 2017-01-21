// @flow
import {expect} from 'chai'
import {checkCourseAgainstQuery} from '../check-course-against-query'

describe('checkCourseAgainstQuery', () => {
	it('compares a course to a query object', () => {
		let query = {departments: ['AMCON'], year: [2013]}
		let course = {departments: ['AMCON'], year: 2013}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
	})

	it('properly handles a list of five years', () => {
		let query = {year: ['$OR', 2010, 2011, 2012, 2013, 2014]}
		let course = {departments: ['ASIAN'], year: 2012}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
	})

	it("handles when a course doesn't have the key", () => {
		let query = {year: ['$OR', 2010, 2011, 2012, 2013, 2014]}
		let course = {departments: ['ASIAN']}
		expect(checkCourseAgainstQuery(query, course)).to.be.false
	})

	it('handles complicated queries', () => {
		let query = {
			departments: ['$AND', 'ASIAN', 'REL'],
			title: ['Japan'],
			level: [200],
			year: [2014],
			semester: ['$OR', 3, 1],
		}
		let course = {
			departments: ['ASIAN', 'REL'],
			year: 2014,
			semester: 1,
			level: 200,
			title: 'Japan',
		}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
	})

	it('handles complicated queries', () => {
		let query = {
			departments: ['$AND', 'ASIAN', 'REL'],
			title: ['Japan'],
			level: [200],
			year: [2014],
			semester: ['$OR', 3, 1],
		}
		let course = {
			departments: ['ASIAN'],
		}
		expect(checkCourseAgainstQuery(query, course)).to.be.false
	})

	it('handles $NOT queries', () => {
		let query = {
			profWords: ['macpherson'],
			deptnum: ['$NOT', 'ASIAN 275'],
		}
		let course = {
			deptnum: 'ASIAN 215',
			profWords: ['kristina', 'macpherson', 'karil', 'kucera'],
		}

		expect(checkCourseAgainstQuery(query, course)).to.be.true
	})

	it('handles $NOR queries', () => {
		let query = {
			profWords: ['macpherson'],
			deptnum: ['$NOR', 'ASIAN 275', 'ASIAN 215'],
		}
		let course = {
			deptnum: 'ASIAN 215',
			profWords: ['kristina', 'macpherson', 'karil', 'kucera'],
		}

		expect(checkCourseAgainstQuery(query, course)).to.be.false

		let truecourse = {
			deptnum: 'ASIAN 250',
			profWords: ['kristina', 'macpherson', 'karil', 'kucera'],
		}

		expect(checkCourseAgainstQuery(query, truecourse)).to.be.true
	})

	it('handles $OR queries', () => {
		let query = {
			profWords: ['macpherson'],
			deptnum: ['$OR', 'ASIAN 275', 'ASIAN 215'],
		}
		let course = {
			deptnum: 'ASIAN 215',
			profWords: ['kristina', 'macpherson', 'karil', 'kucera'],
		}

		expect(checkCourseAgainstQuery(query, course)).to.be.true
	})

	xit('handles $AND queries', () => {

	})

	it('handles $XOR queries', () => {
		const query = {departments: ['$XOR', 'ASIAN', 'ART']}
		let yesCourse = {departments: ['ASIAN']}
		expect(checkCourseAgainstQuery(query, yesCourse)).to.be.true
		let noCourse = {departments: ['ART', 'ASIAN']}
		expect(checkCourseAgainstQuery(query, noCourse)).to.be.false
	})

	it('handles lowercases the checked value for substring matches', () => {
		const query = {title: 'needle'}
		const course = {title: 'NEEDLE'}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
	})

	it('handles substring matches on "title"', () => {
		const query = {title: 'needle'}
		const course = {title: 'needle in a haystack'}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
		const falsecourse = {title: '… in a haystack'}
		expect(checkCourseAgainstQuery(query, falsecourse)).to.be.false
	})
	it('handles substring matches on "name"', () => {
		const query = {name: 'needle'}
		const course = {name: 'needle in a haystack'}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
		const falsecourse = {name: '… in a haystack'}
		expect(checkCourseAgainstQuery(query, falsecourse)).to.be.false
	})
	it('handles substring matches on "description"', () => {
		const query = {description: 'needle'}
		const course = {description: 'needle in a haystack'}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
		const falsecourse = {description: '… in a haystack'}
		expect(checkCourseAgainstQuery(query, falsecourse)).to.be.false
	})
	it('handles substring matches on "notes"', () => {
		const query = {notes: 'needle'}
		const course = {notes: 'needle in a haystack'}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
		const falsecourse = {notes: '… in a haystack'}
		expect(checkCourseAgainstQuery(query, falsecourse)).to.be.false
	})
	it('handles substring matches on "instructors"', () => {
		const query = {instructors: 'needle'}
		const course = {instructors: ['Haystack, Needle III']}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
		const falsecourse = {instructors: '… in a haystack'}
		expect(checkCourseAgainstQuery(query, falsecourse)).to.be.false
	})
	it('handles substring matches on "times"', () => {
		const query = {times: '300'}
		const course = {times: ['1200-300pm']}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
		const falsecourse = {times: '… in a haystack'}
		expect(checkCourseAgainstQuery(query, falsecourse)).to.be.false
	})
	it('handles substring matches on "locations"', () => {
		const query = {locations: '250A'}
		const course = {locations: ['CHM 250A']}
		expect(checkCourseAgainstQuery(query, course)).to.be.true
		const falsecourse = {locations: '… in a haystack'}
		expect(checkCourseAgainstQuery(query, falsecourse)).to.be.false
	})
})
