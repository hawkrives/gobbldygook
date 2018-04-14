/* eslint-env jest */
// @flow

import getCacheStoreName from '../get-cache-store-name'

test('getCacheStoreName runs', () => {
    expect(() => getCacheStoreName('courses')).not.toThrow()
})

test('getCacheStoreName handles courses', () => {
    expect(getCacheStoreName('courses')).toMatchSnapshot()
})

test('getCacheStoreName runs', () => {
    expect(getCacheStoreName('areas')).toMatchSnapshot()
})

test('getCacheStoreName throws an error on unexpected values', () => {
    // $FlowFixMe
    expect(() => getCacheStoreName('invalid')).toThrowErrorMatchingSnapshot()
})
