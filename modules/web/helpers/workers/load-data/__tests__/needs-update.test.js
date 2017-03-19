/* eslint-env jest */
// @flow

jest.mock('../../../db')

import db from '../../../db'
import needsUpdate from '../needs-update'

beforeEach(async () => {
    await db.__clear()
})

describe('needsUpdate > courses', () => {
    test('returns `true` if the requested file isn\'t in the database', async () => {
        await db.store('courseCache').batch([{id: 'missing_path', hash: 'hash1'}])
        expect(await needsUpdate('courses', 'dir/file', 'hash2')).toBe(true)
    })

    test('returns `true` if the requested file has a different hash', async () => {
        await db.store('courseCache').batch([{id: 'good_path', hash: 'hash1'}])
        expect(await needsUpdate('courses', 'good_path', 'hash2')).toBe(true)
    })

    test('returns `false` if the requested file is cached and has the same hash', async () => {
        await db.store('courseCache').batch([{id: 'good_path', hash: 'hash1'}])
        expect(await needsUpdate('courses', 'good_path', 'hash1')).toBe(false)
    })
})

describe('needsUpdate > areas', () => {
    test('returns `true` if the requested file isn\'t in the database', async () => {
        await db.store('areaCache').batch([{id: 'missing_path', hash: 'hash1'}])
        expect(await needsUpdate('areas', 'dir/file', 'hash2')).toBe(true)
    })

    test('returns `true` if the requested file has a different hash', async () => {
        await db.store('areaCache').batch([{id: 'good_path', hash: 'hash1'}])
        expect(await needsUpdate('areas', 'good_path', 'hash2')).toBe(true)
    })

    test('returns `false` if the requested file is cached and has the same hash', async () => {
        await db.store('areaCache').batch([{id: 'good_path', hash: 'hash1'}])
        expect(await needsUpdate('areas', 'good_path', 'hash1')).toBe(false)
    })
})
