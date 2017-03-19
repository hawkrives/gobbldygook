/* eslint-env jest */

jest.mock('../../../db')
jest.mock('../lib-dispatch', () => {
    const NotificationMock = jest.fn(() => ({
        start: jest.fn(),
        increment: jest.fn(),
        remove: jest.fn(),
    }))
    return {
        refreshCourses: jest.fn(),
        refreshAreas: jest.fn(),
        quotaExceededError: jest.fn(),
        Notification: NotificationMock,
    }
})
jest.mock('../needs-update', () => jest.fn(() => Promise.resolve()))
jest.mock('../update-database', () => jest.fn())
jest.mock('../remove-duplicate-areas', () => jest.fn())
jest.mock('../../../../../lib/fetch-helpers', () => {
    return { status: x => x, text: x => x }
})

const goodFetch = jest.fn(url => Promise.resolve(JSON.stringify({ url })))
const badFetch = jest.fn(() => Promise.reject(new Error('could not fetch')))

global.fetch = jest.fn(() => {
    throw new Error('you must pick either goodFetch or badFetch')
})

import db from '../../../db'
import * as dispatch from '../lib-dispatch'
import needsUpdate from '../needs-update'
import updateDatabase from '../update-database'
import removeDuplicateAreas from '../remove-duplicate-areas'
import loadFiles, * as load from '../load-files'

beforeEach(async () => {
    await db.__clear()
    dispatch.refreshCourses.mockClear()
    dispatch.refreshAreas.mockClear()
    dispatch.quotaExceededError.mockClear()
    goodFetch.mockClear()
    badFetch.mockClear()
    needsUpdate.mockClear()
    updateDatabase.mockClear()
    removeDuplicateAreas.mockClear()
})

const mockArgs = type => {
    return {
        type,
        notification: dispatch.Notification(),
        baseUrl: 'url',
        oldestYear: 2000,
    }
}

describe('filterForRecentCourses', () => {
    test('only returns json filerefs', () => {
        const fileRefs = [
            { type: 'json', year: 2000, path: '', hash: '' },
            { type: 'xml', year: 2000, path: '', hash: '' },
            { type: 'csv', year: 2000, path: '', hash: '' },
            { type: 'json', year: 2000, path: '', hash: '' },
        ]
        const actual = fileRefs.filter(f =>
            load.filterForRecentCourses(f, 2000))
        const expected = fileRefs.filter(f => f.type === 'json')
        expect(actual).toEqual(expected)
    })

    test('only returns filerefs since $year', () => {
        const fileRefs = [
            { type: 'json', year: 2000, path: '', hash: '' },
            { type: 'json', year: 2001, path: '', hash: '' },
            { type: 'json', year: 2002, path: '', hash: '' },
            { type: 'json', year: 2003, path: '', hash: '' },
            { type: 'json', year: 2004, path: '', hash: '' },
        ]
        const year = 2002
        const actual = fileRefs.filter(f =>
            load.filterForRecentCourses(f, year))
        const expected = fileRefs.filter(f => f.year >= year)
        expect(actual).toEqual(expected)
    })
})

describe('finishUp', () => {
    test('calls refreshCourses if working on a course index', () => {
        const { type, notification } = mockArgs('courses')

        load.finishUp({ type, notification })

        expect(dispatch.refreshCourses).toHaveBeenCalledTimes(1)
        expect(dispatch.refreshAreas).not.toHaveBeenCalled()
    })

    test('calls refreshAreas if working on an area index', () => {
        const { type, notification } = mockArgs('areas')

        load.finishUp({ type, notification })

        expect(dispatch.refreshAreas).toHaveBeenCalledTimes(1)
        expect(dispatch.refreshCourses).not.toHaveBeenCalled()
    })

    test('removes the notification', () => {
        const { type, notification } = mockArgs('areas')

        load.finishUp({ type, notification })

        expect(notification.remove).toHaveBeenCalledTimes(1)
    })
})

describe('deduplicateAreas', () => {
    test('calls removeDuplicateAreas if working on an area index', () => {
        load.deduplicateAreas(mockArgs('areas'))
        expect(removeDuplicateAreas).toHaveBeenCalledTimes(1)
    })

    test('does not call removeDuplicateAreas unless working on an area index', () => {
        load.deduplicateAreas(mockArgs('courses'))
        expect(removeDuplicateAreas).toHaveBeenCalledTimes(0)
    })
})

describe('slurpIntoDatabase', () => {
    test('exits early if no files are given', async () => {
        const args = mockArgs('courses')
        const fileRefs = []
        await load.slurpIntoDatabase(args, fileRefs)
        expect(updateDatabase).not.toHaveBeenCalled()
    })

    test('starts the notification', async () => {
        const args = mockArgs('courses')
        const fileRefs = [
            { type: 'json', year: 2000, path: '', hash: '' },
            { type: 'json', year: 2001, path: '', hash: '' },
        ]
        await load.slurpIntoDatabase(args, fileRefs)
        expect(args.notification.start).toHaveBeenCalledTimes(1)
        expect(args.notification.start).toHaveBeenCalledWith(fileRefs.length)
    })

    test('calls updateDatabase once for each file given', async () => {
        const args = mockArgs('courses')
        const fileRefs = [
            { type: 'json', year: 2000, path: '', hash: '' },
            { type: 'json', year: 2001, path: '', hash: '' },
            { type: 'json', year: 2002, path: '', hash: '' },
            { type: 'json', year: 2003, path: '', hash: '' },
        ]
        await load.slurpIntoDatabase(args, fileRefs)
        expect(updateDatabase).toHaveBeenCalledTimes(fileRefs.length)
    })
})

describe('filterFiles', () => {
    test('calls needsUpdate once per file', async () => {
        needsUpdate.mockImplementation(() => Promise.resolve(true))
        const args = mockArgs('courses')
        const fileRefs = [
            { type: 'json', year: 2000, path: '', hash: '' },
            { type: 'json', year: 2001, path: '', hash: '' },
            { type: 'json', year: 2002, path: '', hash: '' },
            { type: 'json', year: 2003, path: '', hash: '' },
        ]
        await load.filterFiles(args, fileRefs)
        expect(needsUpdate).toHaveBeenCalledTimes(fileRefs.length)
    })

    test('returns only files that needsUpdate says need updates', async () => {
        needsUpdate
            .mockImplementationOnce(() => Promise.resolve(true))
            .mockImplementationOnce(() => Promise.resolve(false))
            .mockImplementationOnce(() => Promise.resolve(true))
            .mockImplementationOnce(() => Promise.resolve(false))

        const args = mockArgs('courses')
        const fileRefs = [
            { type: 'json', year: 2000, path: '1.json', hash: '' },
            { type: 'json', year: 2001, path: '2.json', hash: '' },
            { type: 'json', year: 2002, path: '3.json', hash: '' },
            { type: 'json', year: 2003, path: '4.json', hash: '' },
        ]
        const actual = await load.filterFiles(args, fileRefs)
        const expected = [fileRefs[0], fileRefs[2]].map(f => f.path)
        expect(actual).toEqual(expected)
        expect(needsUpdate).toHaveBeenCalledTimes(4)
    })
})

describe('getFilesToLoad', () => {
    test('returns the input array if loading areas')
    test('filters the input array if loading courses')
})

describe('proceedWithUpdate', () => {
    test('calls the sequence of functions')
    test('rejects if one fails')
})

describe('loadFiles', () => {
    test('calls fetch with the input url')
    test('calls proceedWithUpdate if the fetch succeeds')
    test('calls handleErrors if the fetch fails')
})
