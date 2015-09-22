import {expect} from 'chai'
import {OrderedMap} from 'immutable'

import reducer, {
	INCREMENT_PROGRESS,
	LOG_ERROR,
	LOG_MESSAGE,
	REMOVE_NOTIFICATION,
	START_PROGRESS,
} from '../../src/ducks/notifications'


describe('notifications reducer', () => {
	it('should return the initial state', () => {
		const expected = OrderedMap()
		const actual = reducer(undefined, {})
		expect(actual).to.deep.equal(expected)
	})

	it('should handle LOG_MESSAGE', () => {
		const id = 1
		const message = 'message'

		const actualState = reducer(undefined, {type: LOG_MESSAGE, payload: {id, message}})
		const expectedState = OrderedMap([[id, {id, message, type: 'message'}]])

		expect(actualState.toJS()).to.deep.equal(expectedState.toJS())
	})

	it('should handle LOG_ERROR', () => {
		const id = 1
		const error = new Error('message')

		const actualState = reducer(undefined, {type: LOG_ERROR, payload: {id, error, args: []}})
		const expectedState = OrderedMap([[id, {id, message: error.message, type: 'error'}]])

		expect(actualState.toJS()).to.deep.equal(expectedState.toJS())
	})

	it('should handle REMOVE_NOTIFICATION', () => {
		const id = 1
		const message = 'message'

		const action = {type: REMOVE_NOTIFICATION, payload: {id, message}}

		const initialState = OrderedMap([[id, {id, message, type: 'message'}]])
		const expectedState = OrderedMap({})
		const actualState = reducer(initialState, action)

		expect(actualState.toJS()).to.deep.equal(expectedState.toJS())
	})

	it('should handle START_PROGRESS', () => {
		const id = 1
		const message = 'message'
		const value = 0
		const max = 1
		const showButton = false

		const actualState = reducer(undefined, {type: START_PROGRESS, payload: {id, message, value, max, showButton}})
		const expectedState = OrderedMap([[id, {id, message, value, max, showButton, type: 'progress'}]])

		expect(actualState.toJS()).to.deep.equal(expectedState.toJS())
	})

	it('should handle INCREMENT_PROGRESS', () => {
		const id = 1
		const message = 'message'
		const value = 0
		const max = 1
		const by = 1
		const showButton = false

		const action = {type: INCREMENT_PROGRESS, payload: {id, by}}

		const initialState = OrderedMap([[id, {id, message, value, max, showButton, type: 'progress'}]])
		const expectedState = OrderedMap([[id, {id, message, value: value + by, max, showButton, type: 'progress'}]])
		const actualState = reducer(initialState, action)

		expect(actualState.toJS()).to.deep.equal(expectedState.toJS())
	})

	it('should not let INCREMENT_PROGRESS go past "max"', () => {
		const id = 1
		const message = 'message'
		const value = 0
		const max = 1
		const by = 5
		const showButton = false

		const action = {type: INCREMENT_PROGRESS, payload: {id, by}}

		const initialState = OrderedMap([[id, {id, message, value, max, showButton, type: 'progress'}]])
		const expectedState = OrderedMap([[id, {id, message, value: 1, max, showButton, type: 'progress'}]])
		const actualState = reducer(initialState, action)

		expect(actualState.toJS()).to.deep.equal(expectedState.toJS())
	})

	it('should allow custom values for INCREMENT_PROGRESS', () => {
		const id = 1
		const message = 'message'
		const value = 5
		const max = 10
		const by = 5
		const showButton = false

		const action = {type: INCREMENT_PROGRESS, payload: {id, by}}

		const initialState = OrderedMap([[id, {id, message, value, max, showButton, type: 'progress'}]])
		const expectedState = OrderedMap([[id, {id, message, value: value + by, max, showButton, type: 'progress'}]])
		const actualState = reducer(initialState, action)

		expect(actualState.toJS()).to.deep.equal(expectedState.toJS())
	})

	it('should not mutate the progress item during INCREMENT_PROGRESS', () => {
		const id = 1
		const notification = {id, message: '', value: 0, max: 1, showButton: true}

		const action = {type: INCREMENT_PROGRESS, payload: {id, by: 1}}

		const initialState = OrderedMap([[id, notification]])
		const actualState = reducer(initialState, action)

		expect(initialState.get(id)).not.to.equal(actualState.get(id))
	})
})
