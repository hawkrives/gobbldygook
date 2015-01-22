// test/models/study.test.js
jest.dontMock('../../app/models/study.js')
import Study from '../../app/models/study.js'

describe('Study', () => {
	it('is a Study', () => {
		let csci = new Study({id: 'm-csci', index: 0, revisionYear: 2014})
		expect(csci instanceof Study).toBe(true)
	})

	it('can be turned into a JS object', () => {
		let csci = new Study({id: 'm-csci', index: 0, revisionYear: 2014})
		expect(csci.toJS() instanceof Object).toBe(true)
	})

	it('ignores sets on known properties', () => {
		let csci = new Study({id: 'm-csci', index: 0, revisionYear: 2014})
		try {
			csci.index = 3
		} catch (err) {}
		expect(csci.index).toBe(0)
	})

	it('holds an area of study for a student', () => {
		let csci = new Study({id: 'm-csci', index: 0, revisionYear: 2014})
		let result = csci.toJS()

		let {id, type, abbr, title, index, revisionYear, check} = result

		expect(id).toBe('m-csci')
		expect(type).toBe('major')
		expect(abbr).toBe('CSCI')
		expect(title).toBe('Computer Science')
		expect(index).toBe(0)
		expect(revisionYear).toBe(2014)
		expect(typeof check).toBe('function')
	})

	it('supports Study.reorder to rearrange itself', () => {
		let csci = new Study({id: 'm-csci', index: 0, revisionYear: 2014})
		csci = csci.reorder(3)
		let result = csci.toJS()

		expect(result.index).toBe(3)
	})

	it('can turn into JSON', () => {
		let csci = new Study({id: 'm-csci', index: 0, revisionYear: 2014})
		let result = JSON.stringify(csci)

		expect(result).toBeTruthy()
	})

	it('only translates some properties into the JSON bit', () => {
		let csci = new Study({id: 'm-csci', index: 0, revisionYear: 2014})
		let result = JSON.stringify(csci)

		expect(result).toBe('{"id":"m-csci","index":0,"revisionYear":2014}')
	})
})
