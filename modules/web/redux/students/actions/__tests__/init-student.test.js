// @flow
import {expect} from 'chai'

import {initStudent} from '../init-student'

import {INIT_STUDENT} from '../../constants'

describe('initStudent action', () => {
	it('returns an action to create a student', () => {
		let action = initStudent()

		expect(action).to.have.property('type', INIT_STUDENT)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
	})
})
