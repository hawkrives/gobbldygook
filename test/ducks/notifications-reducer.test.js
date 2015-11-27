import {expect} from 'chai'
import find from 'lodash/collection/find'

import {
	INCREMENT_PROGRESS,
	LOG_ERROR,
	LOG_MESSAGE,
	REMOVE_NOTIFICATION,
	START_PROGRESS,
} from '../../src/ducks/constants/notifications'
import reducer from '../../src/ducks/reducers/notifications'


describe('notifications reducer', () => {
	it('should return the initial state', () => {
		const expected = []
		const actual = reducer(undefined, {})
		expect(actual).to.deep.equal(expected)
	})

	it('should handle LOG_MESSAGE', () => {
		const id = 1
		const message = 'message'

		const actualState = reducer(undefined, {type: LOG_MESSAGE, payload: {id, message}})
		const expectedState = [{id, message, type: 'message'}]

		expect(actualState).to.deep.equal(expectedState)
	})

	it('should handle LOG_ERROR', () => {
		const id = 1
		const error = new Error('message')

		const actualState = reducer(undefined, {type: LOG_ERROR, payload: {id, error, args: []}})
		const expectedState = [{id, message: error.message, type: 'error'}]

		expect(actualState).to.deep.equal(expectedState)
	})

	it('should handle REMOVE_NOTIFICATION', () => {
		const id = 1
		const message = 'message'

		const action = {type: REMOVE_NOTIFICATION, payload: {id, message}}

		const initialState = [{id, message, type: 'message'}]
		const expectedState = []
		const actualState = reducer(initialState, action)

		expect(actualState).to.deep.equal(expectedState)
	})

	it('should handle START_PROGRESS', () => {
		const id = 1
		const message = 'message'
		const value = 0
		const max = 1
		const showButton = false

		const actualState = reducer(undefined, {type: START_PROGRESS, payload: {id, message, value, max, showButton}})
		const expectedState = [{id, message, value, max, showButton, type: 'progress'}]

		expect(actualState).to.deep.equal(expectedState)
	})

	it('should handle INCREMENT_PROGRESS', () => {
		const id = 1
		const message = 'message'
		const value = 0
		const max = 1
		const by = 1
		const showButton = false

		const action = {type: INCREMENT_PROGRESS, payload: {id, by}}

		const initialState = [{id, message, value, max, showButton, type: 'progress'}]
		const expectedState = [{id, message, value: value + by, max, showButton, type: 'progress'}]
		const actualState = reducer(initialState, action)

		expect(actualState).to.deep.equal(expectedState)
	})

	it('should not let INCREMENT_PROGRESS go past "max"', () => {
		const id = 1
		const message = 'message'
		const value = 0
		const max = 1
		const by = 5
		const showButton = false

		const action = {type: INCREMENT_PROGRESS, payload: {id, by}}

		const initialState = [{id, message, value, max, showButton, type: 'progress'}]
		const expectedState = [{id, message, value: 1, max, showButton, type: 'progress'}]
		const actualState = reducer(initialState, action)

		expect(actualState).to.deep.equal(expectedState)
	})

	it('should allow custom values for INCREMENT_PROGRESS', () => {
		const id = 1
		const message = 'message'
		const value = 5
		const max = 10
		const by = 5
		const showButton = false

		const action = {type: INCREMENT_PROGRESS, payload: {id, by}}

		const initialState = [{id, message, value, max, showButton, type: 'progress'}]
		const expectedState = [{id, message, value: value + by, max, showButton, type: 'progress'}]
		const actualState = reducer(initialState, action)

		expect(actualState).to.deep.equal(expectedState)
	})

	it('should not mutate the progress item during INCREMENT_PROGRESS', () => {
		const id = 1
		const notification = {id, message: '', value: 0, max: 1, showButton: true}

		const action = {type: INCREMENT_PROGRESS, payload: {id, by: 1}}

		const initialState = [notification]
		const actualState = reducer(initialState, action)

		expect(find(initialState, {id})).not.to.equal(find(actualState, {id}))
	})
})
