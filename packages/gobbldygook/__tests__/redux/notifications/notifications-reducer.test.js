import {expect} from 'chai'

import {
	INCREMENT_PROGRESS,
	LOG_ERROR,
	LOG_MESSAGE,
	REMOVE_NOTIFICATION,
	START_PROGRESS,
} from '../../src/redux/notifications/constants'
import reducer from '../../src/redux/notifications/reducers'


describe('notifications reducer', () => {
	it('returns the initial state', () => {
		const expected = []
		const actual = reducer(undefined, {})
		expect(actual).to.deep.equal(expected)
	})

	it('handles LOG_MESSAGE', () => {
		const message = 'message'

		const actualState = reducer(undefined, {type: LOG_MESSAGE, payload: {message}})
		const expectedState = [{message, type: 'message'}]

		expect(actualState).to.deep.equal(expectedState)
	})

	it('handles LOG_ERROR', () => {
		const error = new Error('message')

		const actualState = reducer(undefined, {type: LOG_ERROR, payload: {error, args: []}})
		const expectedState = [{message: error.message, type: 'error'}]

		expect(actualState).to.deep.equal(expectedState)
	})

	it('handles REMOVE_NOTIFICATION', () => {
		const index = 0
		const message = 'message'

		const action = {type: REMOVE_NOTIFICATION, payload: {index, message}}

		const initialState = [{message, type: 'message'}]
		const expectedState = []
		const actualState = reducer(initialState, action)

		expect(actualState).to.deep.equal(expectedState)
	})

	it('handles START_PROGRESS', () => {
		const message = 'message'
		const value = 0
		const max = 1
		const showButton = false

		const actualState = reducer(undefined, {type: START_PROGRESS, payload: {message, value, max, showButton}})
		const expectedState = [{message, value, max, showButton, type: 'progress'}]

		expect(actualState).to.deep.equal(expectedState)
	})

	it('handles INCREMENT_PROGRESS', () => {
		const index = 0
		const message = 'message'
		const value = 0
		const max = 1
		const by = 1
		const showButton = false

		const action = {type: INCREMENT_PROGRESS, payload: {index, by}}

		const initialState = [{message, value, max, showButton, type: 'progress'}]
		const expectedState = [{message, value: value + by, max, showButton, type: 'progress'}]
		const actualState = reducer(initialState, action)

		expect(actualState).to.deep.equal(expectedState)
	})

	it('does not let INCREMENT_PROGRESS go past "max"', () => {
		const index = 0
		const message = 'message'
		const value = 0
		const max = 1
		const by = 5
		const showButton = false

		const action = {type: INCREMENT_PROGRESS, payload: {index, by}}

		const initialState = [{message, value, max, showButton, type: 'progress'}]
		const expectedState = [{message, value: 1, max, showButton, type: 'progress'}]
		const actualState = reducer(initialState, action)

		expect(actualState).to.deep.equal(expectedState)
	})

	it('allows custom values for INCREMENT_PROGRESS', () => {
		const index = 0
		const message = 'message'
		const value = 5
		const max = 10
		const by = 5
		const showButton = false

		const action = {type: INCREMENT_PROGRESS, payload: {index, by}}

		const initialState = [{message, value, max, showButton, type: 'progress'}]
		const expectedState = [{message, value: value + by, max, showButton, type: 'progress'}]
		const actualState = reducer(initialState, action)

		expect(actualState).to.deep.equal(expectedState)
	})

	it('does not mutate the progress item during INCREMENT_PROGRESS', () => {
		const index = 0
		const notification = {index, message: '', value: 0, max: 1, showButton: true}

		const action = {type: INCREMENT_PROGRESS, payload: {index, by: 1}}

		const initialState = [notification]
		const actualState = reducer(initialState, action)

		expect(initialState[0]).not.to.equal(actualState[0])
	})
})
