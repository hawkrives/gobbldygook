import {expect} from 'chai'
import Study from '../../src/models/study'

describe('Study', () => {
	it('is a Study', () => {
		let csci = new Study({type: 'major', name: 'Computer Science', revision: '2014-15'})
		expect(csci instanceof Study).to.be.true
	})

	it('can be turned into a JS object', () => {
		let csci = new Study({type: 'major', name: 'Computer Science', revision: '2014-15'})
		expect(csci.toJS()).to.be.an.instanceof(Object)
	})

	it('ignores sets on known properties', () => {
		let csci = new Study({type: 'major', name: 'Computer Science', revision: '2014-15'})
		try {
			csci.type = 'concentration'
		}
		catch (err) {}
		expect(csci.type).to.equal('major')
	})

	it('holds an area of study for a student', () => {
		let csci = new Study({type: 'major', name: 'Computer Science', revision: '2014-15'})
		let result = csci.toJS()

		let {id, type, name, revision, data} = result

		expect(id).to.equal('majors/computer-science-2014-15')
		expect(type).to.equal('major')
		expect(name).to.equal('Computer Science')
		expect(revision).to.equal('2014-15')
		expect(data).to.be.an.instanceof(Promise)
	})

	it('can turn into JSON', () => {
		let csci = new Study({type: 'major', name: 'Computer Science', revision: '2014-15'})
		let result = JSON.stringify(csci)

		expect(JSON.parse(result)).to.deep.equal({
			type: 'major',
			name: 'Computer Science',
			revision: '2014-15',
		})
	})

	it('only translates some properties into the JSON bit', () => {
		let csci = new Study({type: 'major', name: 'Computer Science', revision: '2014-15'})
		let result = JSON.stringify(csci)

		expect(JSON.parse(result)).to.deep.equal({
			name: 'Computer Science',
			type: 'major',
			revision: '2014-15',
		})
	})
})
