/* eslint-env jest */

jest.mock('../../../db')
jest.mock('../../../../../lib/fetch-helpers', () => {
    return {status: x => x, text: x => x}
})

jest.mock('../clean-prior-data', () => {
    return jest.fn()
        .mockReturnValueOnce(() => Promise.reject())
        .mockReturnValueOnce(() => Promise.resolve())
})
jest.mock('../lib-dispatch', () => {
    return jest.fn()
})
jest.mock('../store-data', () => {
    return jest.fn().mockReturnValue(() => Promise.resolve())
})
jest.mock('../cache-item-hash', () => {
    return jest.fn().mockReturnValue(() => Promise.resolve())
})

global.fetch = jest.fn(url =>
    Promise.resolve(JSON.stringify({foo:2, url})))

import db from '../../../db'
import cleanPriorData from '../clean-prior-data'
import dispatch from '../lib-dispatch'
import storeData from '../store-data'
import cacheItemHash from '../cache-item-hash'
import updateDatabase from '../update-database'

beforeEach(async () => {
    await db.__clear()
})

test('updateDatabase florp', async () => {
    // await updateDatabase('courses', 'http://i.am.an.url/', '1', {path: 'terms/20161.json', hash: 'deadbeef'})
})

test('updateDatabase returns false if any step fails', async () => {
    const value = await updateDatabase('courses', 'http://i.am.an.url/', '1', {path: 'terms/20161.json', hash: 'deadbeef'})
    expect(cleanPriorData).toHaveBeenCalled()
    console.log(cleanPriorData.mock.calls)
    console.log(fetch.mock.calls)
    expect(storeData).toHaveBeenCalled()
    console.log(cleanPriorData.mock.calls)
    expect(cacheItemHash).toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalled()
    expect(value).toBe(false)
})
