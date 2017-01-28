import { expect } from 'chai'

import {
	changeName,
	changeAdvisor,
	changeCreditsNeeded,
	changeMatriculation,
	changeGraduation,
	changeSetting,
} from '../change'

import {
	CHANGE_NAME,
	CHANGE_ADVISOR,
	CHANGE_CREDITS_NEEDED,
	CHANGE_MATRICULATION,
	CHANGE_GRADUATION,
	CHANGE_SETTING,
} from '../../constants'

describe('changeName action', () => {
	it('returns an action to change the name of a student', () => {
		let action = changeName('id', 'new name')
		expect(action).to.have.property('type', CHANGE_NAME)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			name: 'new name',
		})
	})
})

describe('changeAdvisor action', () => {
	it('returns an action to change the advisor of a student', () => {
		let action = changeAdvisor('id', 'new advisor')
		expect(action).to.have.property('type', CHANGE_ADVISOR)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			advisor: 'new advisor',
		})
	})
})

describe('changeCreditsNeeded action', () => {
	it('returns an action to change the creditsNeeded of a student', () => {
		let action = changeCreditsNeeded('id', 30)
		expect(action).to.have.property('type', CHANGE_CREDITS_NEEDED)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			credits: 30,
		})
	})
})

describe('changeMatriculation action', () => {
	it('returns an action to change the matriculation of a student', () => {
		let action = changeMatriculation('id', 1800)
		expect(action).to.have.property('type', CHANGE_MATRICULATION)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			matriculation: 1800,
		})
	})
})

describe('changeGraduation action', () => {
	it('returns an action to change the graduation of a student', () => {
		let action = changeGraduation('id', 2100)
		expect(action).to.have.property('type', CHANGE_GRADUATION)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			graduation: 2100,
		})
	})
})

describe('changeSetting action', () => {
	it('returns an action to change the setting of a student', () => {
		let action = changeSetting('id', 'key', 'val')
		expect(action).to.have.property('type', CHANGE_SETTING)
		expect(action).to.have.property('payload')
		expect(action.payload).to.be.an.object
		expect(action.payload).to.deep.equal({
			studentId: 'id',
			key: 'key',
			value: 'val',
		})
	})
})
