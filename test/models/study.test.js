// test/models/study.test.js
jest.dontMock('../../app/models/study.js')
import Study from '../../app/models/study.js'

describe('Study', () => {
	it('is a Study', () => {
		let csci = new Study({id: 'm-csci', revisionYear: 2014})
		expect(csci instanceof Study).toBe(true)
	})

	it('can be turned into a JS object', () => {
		let csci = new Study({id: 'm-csci', revisionYear: 2014})
		expect(csci.toJS() instanceof Object).toBe(true)
	})

	it('ignores sets on known properties', () => {
		let csci = new Study({id: 'm-csci', revisionYear: 2014})
		try {
			csci.id = 'm-asian'
		} catch (err) {}
		expect(csci.id).toBe('m-csci')
	})

	it('holds an area of study for a student', () => {
		let csci = new Study({id: 'm-csci', revisionYear: 2014})
		let result = csci.toJS()

		let {id, type, abbr, title, revisionYear, check} = result

		expect(id).toBe('m-csci')
		expect(type).toBe('major')
		expect(abbr).toBe('CSCI')
		expect(title).toBe('Computer Science')
		expect(revisionYear).toBe(2014)
		expect(typeof check).toBe('function')
	})

	it('can turn into JSON', () => {
		let csci = new Study({id: 'm-csci', revisionYear: 2014})
		let result = JSON.stringify(csci)

		expect(result).toBeTruthy()
	})

	it('only translates some properties into the JSON bit', () => {
		let csci = new Study({id: 'm-csci', revisionYear: 2014})
		let result = JSON.stringify(csci)

		expect(result).toBe('{"id":"m-csci","revisionYear":2014}')
	})
})
