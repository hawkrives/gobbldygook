/* eslint-env jest */

jest.mock('../../../db')
jest.mock('../lib-dispatch', () => {
    const NotificationMock = jest.fn(() => ({
        start: jest.fn(),
        increment: jest.fn(),
        remove: jest.fn(),
    }))
    return {
        quotaExceededError: jest.fn(),
        Notification: NotificationMock,
    }
})
jest.mock('../clean-prior-data', () => jest.fn())
jest.mock('../store-data', () => jest.fn())
jest.mock('../parse-data', () => jest.fn())
jest.mock('../cache-item-hash', () => jest.fn())
jest.mock('../../../../../lib/fetch-helpers', () => {
    return { status: x => x, text: x => x }
})

const goodFetch = jest.fn(url => Promise.resolve(JSON.stringify({ url })))
const badFetch = jest.fn(() => Promise.reject(new Error('could not fetch')))

global.fetch = jest.fn(() => {
    throw new Error('you must pick either goodFetch or badFetch')
})

import db from '../../../db'
import cleanPriorData from '../clean-prior-data'
import * as dispatch from '../lib-dispatch'
import storeData from '../store-data'
import cacheItemHash from '../cache-item-hash'
import updateDatabase from '../update-database'

beforeEach(async () => {
    await db.__clear()
    goodFetch.mockClear()
    badFetch.mockClear()
    cleanPriorData.mockClear()
    dispatch.quotaExceededError.mockClear()
    storeData.mockClear()
    cacheItemHash.mockClear()
})

describe('updateDatabase', () => {
    test('calls fetch with an url', async () => {
        global.fetch.mockImplementationOnce(goodFetch)
        await updateDatabase(
            'courses',
            'http://unique.com/',
            dispatch.Notification(),
            {
                path: 'folder/file.json',
                hash: 'badidea',
            }
        )
        expect(global.fetch).toHaveBeenLastCalledWith(
            'http://unique.com//folder/file.json?v=badidea'
        )
    })

    describe('calls an internal callback', () => {
        test('the onFailure callback if fetch rejects', async () => {
            global.fetch.mockImplementationOnce(badFetch)
            const result = await updateDatabase(
                'courses',
                'http://i.am.an.url/',
                dispatch.Notification(),
                { path: 'terms/20161.json', hash: 'deadbeef' }
            )

            expect(global.fetch).toHaveBeenCalledTimes(1)
            expect(result).toBe(false)
        })

        test('the nextStep callback if fetch resolves', async () => {
            global.fetch.mockImplementationOnce(goodFetch)
            const result = await updateDatabase(
                'courses',
                'http://i.am.an.url/',
                dispatch.Notification(),
                { path: 'terms/20161.json', hash: 'deadbeef' }
            )

            expect(global.fetch).toHaveBeenCalledTimes(1)
            expect(result).toBe(true)
        })
    })

    describe('increments the notification', () => {
        test('even if the fetch works', async () => {
            global.fetch.mockImplementationOnce(goodFetch)
            const n = dispatch.Notification()
            await updateDatabase('courses', 'http://i.am.an.url/', n, {
                path: 'terms/20161.json',
                hash: 'deadbeef',
            })
            expect(n.increment).toHaveBeenCalledTimes(1)
        })

        test('even if the fetch fails', async () => {
            global.fetch.mockImplementationOnce(badFetch)
            const n = dispatch.Notification()
            await updateDatabase('courses', 'http://i.am.an.url/', n, {
                path: 'terms/20161.json',
                hash: 'deadbeef',
            })
            expect(n.increment).toHaveBeenCalledTimes(1)
        })
    })

    test('calls a sequence of functions', async () => {
        global.fetch.mockImplementationOnce(goodFetch)

        await updateDatabase(
            'courses',
            'http://i.am.an.url/',
            dispatch.Notification(),
            {
                path: 'terms/20161.json',
                hash: 'deadbeef',
            }
        )

        expect(cleanPriorData).toHaveBeenCalledTimes(1)
        expect(storeData).toHaveBeenCalledTimes(1)
        expect(cacheItemHash).toHaveBeenCalledTimes(1)
    })

    test('aborts the sequence if one rejects', async () => {
        global.fetch.mockImplementationOnce(goodFetch)
        cleanPriorData.mockImplementationOnce(() =>
            Promise.reject(new Error('problem')))
        expect.assertions(3)

        await updateDatabase(
            'courses',
            'http://i.am.an.url/',
            dispatch.Notification(),
            {
                path: 'terms/20161.json',
                hash: 'deadbeef',
            }
        )

        expect(cleanPriorData).toHaveBeenCalledTimes(1)
        expect(storeData).not.toHaveBeenCalled()
        expect(cacheItemHash).not.toHaveBeenCalled()
    })

    describe('returns', () => {
        test('false if the fetch fails', async () => {
            global.fetch.mockImplementationOnce(badFetch)
            const value = await updateDatabase(
                'courses',
                'http://i.am.an.url/',
                dispatch.Notification(),
                {
                    path: 'terms/20161.json',
                    hash: 'deadbeef',
                }
            )
            expect(value).toBe(false)
        })

        test('false if any step fails', async () => {
            global.fetch.mockImplementationOnce(goodFetch)
            storeData.mockImplementationOnce(() =>
                Promise.reject(new Error('problem')))
            const value = await updateDatabase(
                'courses',
                'http://i.am.an.url/',
                dispatch.Notification(),
                {
                    path: 'terms/20161.json',
                    hash: 'deadbeef',
                }
            )
            expect(value).toBe(false)
        })

        test('true if no steps fail', async () => {
            global.fetch.mockImplementationOnce(goodFetch)
            const value = await updateDatabase(
                'courses',
                'http://i.am.an.url/',
                dispatch.Notification(),
                {
                    path: 'terms/20161.json',
                    hash: 'deadbeef',
                }
            )
            expect(value).toBe(true)
        })
    })
})
