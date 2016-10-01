import {expect} from 'chai'

import {importStudent} from '../import-student'
import {IMPORT_STUDENT} from '../../constants'

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
		expect(action.payload.message.indexOf('Unexpected token ^')).to.equal(0)
	})
})
