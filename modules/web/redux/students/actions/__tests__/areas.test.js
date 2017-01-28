import { expect } from 'chai'

import {
	addArea,
	removeArea,
	removeAreas,
} from '../areas'

import {
	ADD_AREA,
	REMOVE_AREA,
	REMOVE_AREAS,
} from '../../constants'

describe('addArea action', () => {
	it('returns an action to add an area to a student', () => {
		let action = addArea('id', { name: 'Area', type: 'Study?' })
		expect(action).to.have.property('type', ADD_AREA)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
	})
})

describe('removeArea action', () => {
	it('returns an action to remove an area from a student', () => {
		let action = removeArea('id', { name: 'Area', type: 'Study?' })
		expect(action).to.have.property('type', REMOVE_AREA)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			areaQuery: { name: 'Area', type: 'Study?' },
		})
	})
})

describe('removeAreas action', () => {
	it('returns an action to remove several areas from a student', () => {
		let action = removeAreas('id', { name: 'Area', type: 'Study?' })
		expect(action).to.have.property('type', REMOVE_AREAS)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			areaQueries: [ { name: 'Area', type: 'Study?' } ],
		})
	})
})
