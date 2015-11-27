import {expect} from 'chai'
import mock from 'mock-require'
import stringify from 'json-stable-stringify'

mock('../../src/models/load-area', require('../mocks/load-area.mock'))
const Study = require('../../src/models/study')

describe('Study', () => {
	it('holds an area of study for a student', () => {
		let csci = new Study({type: 'major', name: 'Computer Science', revision: '2014-15'})

		let {path, type, name, revision, data} = csci

		expect(path).to.equal('majors/computer-science/2014-15')
		expect(type).to.equal('major')
		expect(name).to.equal('Computer Science')
		expect(revision).to.equal('2014-15')
		expect(data).to.be.an.instanceof(Promise)
	})

	it('can turn into JSON', () => {
		let csci = new Study({type: 'major', name: 'Computer Science', revision: '2014-15'})
		let result = stringify(csci)

		expect(JSON.parse(result)).to.deep.equal({
			name: 'Computer Science',
			path: 'majors/computer-science/2014-15',
			revision: '2014-15',
			type: 'major',
			source: '',
		})
	})
})
