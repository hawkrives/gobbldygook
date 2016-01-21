import {expect} from 'chai'

const {importStudent} = require('../../src/redux/students/actions/import-student')
const {IMPORT_STUDENT} = require('../../src/redux/students/constants')

describe('importStudent action', () => {
	it('returns an action to import a student', () => {
		let action = importStudent({})

		expect(action).to.have.property('type', IMPORT_STUDENT)
		expect(action).to.have.property('payload')
	})

	it('includes an "error" property if there is an error', () => {
		let action = importStudent({data: '^INVALID_JSON^', type: 'application/json'})
		expect(action).to.have.property('error', true)
		expect(action).to.have.property('payload')
		expect(action.payload).to.have.property('message', 'Unexpected token ^')
	})
})
