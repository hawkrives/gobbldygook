import {expect} from 'chai'

const {addFabrication, removeFabrication} = require('../../src/redux/students/actions/fabrications')

const {
	ADD_FABRICATION,
	REMOVE_FABRICATION,
} = require('../../src/redux/students/constants')

describe('addFabrication action', () => {
	it('returns an action to add a fabrication', () => {
		let action = addFabrication('id', {'fab/path': true})
		expect(action).to.have.property('type', ADD_FABRICATION)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			fabrication: {'fab/path': true},
		})
	})
})

describe('removeFabrication action', () => {
	it('returns an action to remove a fabrication', () => {
		let action = removeFabrication('id', 'fab/path')
		expect(action).to.have.property('type', REMOVE_FABRICATION)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			fabricationId: 'fab/path',
		})
	})
})
