// tests/queryStuff-test.js
import 'should'
import buildQueryFromString from 'app/helpers/queryStuff'

describe('buildQueryFromString', () => {
	it('builds a query string with multiple keys into a query object', () => {
		let query = 'dept: Computer Science  dept: Asian Studies  name: Parallel  level: 300  year: $OR year:2013 year: 2014'
		let expectedResult = {
			depts: ['$AND', 'CSCI', 'ASIAN'],
			title: ['Parallel'],
			level: [300],
			year: ['$OR', 2013, 2014],
		}

		buildQueryFromString(query).should.eql(expectedResult)
	})

	it('builds a query string with variable-case keys into a query object', () => {
		let query = 'dept: ASIAN  Dept: Religion  title: "Japan*"  LEVEL: 200  year: 2014  semester: $OR  semester: 3  semester: 1'
		let expectedResult = {
			depts: ['$AND', 'ASIAN', 'REL'],
			title: ['"Japan*"'],
			level: [200],
			year: [2014],
			sem: ['$OR', 3, 1],
		}

		buildQueryFromString(query).should.eql(expectedResult)
	})

	it('builds a query string even with somewhat unconventional input', () => {
		let query = 'department: American Conversations  name: Independence  year: 2014  time: Tuesdays after 12'
		let expectedResult = {
			depts: ['AMCON'],
			title: ['Independence'],
			year: [2014],
			times: ['tuesdays after 12'],
		}

		buildQueryFromString(query).should.eql(expectedResult)
	})

	it('builds a query string while deduplicating synonyms of keys', () => {
		let query = 'ges: $AND  geneds: history of western culture gened: HBS  semester: Spring  year: 2014'
		let expectedResult = {
			gereqs: ['$AND', 'HWC', 'HBS'],
			sem: [3],
			year: [2014],
		}

		buildQueryFromString(query).should.eql(expectedResult)
	})

	it('builds a query string even with no keys', () => {
		let query = 'History of Asia'
		let expectedResult ={
			title: ['History of Asia'],
		}

		buildQueryFromString(query).should.eql(expectedResult)
	})
})
