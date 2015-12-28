import {expect} from 'chai'
import mock from 'mock-require'
import stringify from 'json-stable-stringify'

mock('../../src/helpers/load-area', require('../mocks/load-area.mock').default)
const Study = require('../../src/models/study').default

describe('Study', () => {
	it('holds an area of study for a student', () => {
		let csci = Study({type: 'major', name: 'Computer Science', revision: '2014-15'})

		expect(csci.type).to.equal('major')
		expect(csci.name).to.equal('Computer Science')
		expect(csci.revision).to.equal('2014-15')
		expect(csci.data).to.be.an.instanceof(Promise)
	})

	it('can turn into JSON', () => {
		let csci = Study({type: 'major', name: 'Computer Science', revision: '2014-15'})
		let result = stringify(csci)

		expect(JSON.parse(result)).to.deep.equal({
			name: 'Computer Science',
			revision: '2014-15',
			type: 'major',
			source: '',
		})
	})

	it('catches errors and puts them in _error', async () => {
		let csci = Study({type: 'major', name: 'Computer Science', revision: '2014-15', _shouldError: true})

		expect(csci.name).to.equal('Computer Science')
		expect(csci.revision).to.equal('2014-15')
		expect(csci.type).to.equal('major')
		expect(await csci.data).to.have.property('_error', 'Error!')
	})
})
