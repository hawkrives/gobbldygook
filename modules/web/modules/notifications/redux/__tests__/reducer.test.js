import { expect } from 'chai'

import {
    INCREMENT_PROGRESS,
    LOG_ERROR,
    LOG_MESSAGE,
    REMOVE_NOTIFICATION,
    START_PROGRESS,
} from '../constants'
import reducer from '../reducers'

describe('notifications reducer', () => {
    it('returns the initial state', () => {
        const expected = {}
        const actual = reducer(undefined, {})
        expect(actual).to.deep.equal(expected)
    })

    it('handles LOG_MESSAGE', () => {
        const message = 'message'

        const actualState = reducer(undefined, {
            type: LOG_MESSAGE,
            payload: { id: 0, message },
        })
        const expectedState = { 0: { message, type: 'message' } }

        expect(actualState).to.deep.equal(expectedState)
    })

    it('handles LOG_ERROR', () => {
        const error = new Error('message')

        const actualState = reducer(undefined, {
            type: LOG_ERROR,
            payload: { id: 0, error, args: [] },
        })
        const expectedState = { 0: { message: error.message, type: 'error' } }

        expect(actualState).to.deep.equal(expectedState)
    })

    it('handles REMOVE_NOTIFICATION', () => {
        const id = 0
        const message = 'message'

        const action = { type: REMOVE_NOTIFICATION, payload: { id, message } }

        const initialState = { [id]: { message, type: 'message' } }
        const expectedState = {}
        const actualState = reducer(initialState, action)

        expect(actualState).to.deep.equal(expectedState)
    })

    it('handles START_PROGRESS', () => {
        const id = 0
        const message = 'message'
        const value = 0
        const max = 1
        const showButton = false

        const actualState = reducer(undefined, {
            type: START_PROGRESS,
            payload: { id, message, value, max, showButton },
        })
        const expectedState = {
            [id]: { message, value, max, showButton, type: 'progress' },
        }

        expect(actualState).to.deep.equal(expectedState)
    })

    it('handles INCREMENT_PROGRESS', () => {
        const id = 0
        const message = 'message'
        const value = 0
        const max = 1
        const by = 1
        const showButton = false

        const action = { type: INCREMENT_PROGRESS, payload: { id, by } }

        const initialState = {
            [id]: { message, value, max, showButton, type: 'progress' },
        }
        const expectedState = {
            [id]: {
                message,
                value: value + by,
                max,
                showButton,
                type: 'progress',
            },
        }
        const actualState = reducer(initialState, action)

        expect(actualState).to.deep.equal(expectedState)
    })

    it('does not let INCREMENT_PROGRESS go past "max"', () => {
        const id = 0
        const message = 'message'
        const value = 0
        const max = 1
        const by = 5
        const showButton = false

        const action = { type: INCREMENT_PROGRESS, payload: { id, by } }

        const initialState = {
            [id]: { message, value, max, showButton, type: 'progress' },
        }
        const expectedState = {
            [id]: { message, value: 1, max, showButton, type: 'progress' },
        }
        const actualState = reducer(initialState, action)

        expect(actualState).to.deep.equal(expectedState)
    })

    it('allows custom values for INCREMENT_PROGRESS', () => {
        const id = 0
        const message = 'message'
        const value = 5
        const max = 10
        const by = 5
        const showButton = false

        const action = { type: INCREMENT_PROGRESS, payload: { id, by } }

        const initialState = {
            [id]: { message, value, max, showButton, type: 'progress' },
        }
        const expectedState = {
            [id]: {
                message,
                value: value + by,
                max,
                showButton,
                type: 'progress',
            },
        }
        const actualState = reducer(initialState, action)

        expect(actualState).to.deep.equal(expectedState)
    })

    it('does not mutate the progress item during INCREMENT_PROGRESS', () => {
        const id = 0
        const notification = {
            id,
            message: '',
            value: 0,
            max: 1,
            showButton: true,
        }

        const action = { type: INCREMENT_PROGRESS, payload: { id, by: 1 } }

        const initialState = { [id]: notification }
        const actualState = reducer(initialState, action)

        expect(initialState[id]).not.to.equal(actualState[id])
    })
})
