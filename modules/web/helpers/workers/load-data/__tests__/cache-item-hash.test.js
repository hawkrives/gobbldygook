/* eslint-env jest */
// @flow

jest.mock('../../../db')

import db from '../../../db'
import cacheItemHash from '../cache-item-hash'

beforeEach(async () => {
    await db.__clear()
})

test('cacheItemHash runs', () => {
    expect(() =>
        cacheItemHash('folder/file', 'courses', 'deadbeef')
    ).not.toThrow()
})

test('cacheItemHash stores data', async () => {
    await cacheItemHash('folder/file', 'courses', 'deadbeef')
    expect(await db.store('courseCache').get('folder/file')).toMatchSnapshot()
})
