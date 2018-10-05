/* eslint-env jest */
// @flow

jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn())
jest.spyOn(global.console, 'warn').mockImplementation(() => jest.fn())

import getCacheStoreName from '../get-cache-store-name'

test('getCacheStoreName runs', () => {
	expect(() => getCacheStoreName('courses')).not.toThrow()
})

test('getCacheStoreName handles courses', () => {
	expect(getCacheStoreName('courses')).toMatchInlineSnapshot(`"courseCache"`)
})

test('getCacheStoreName runs', () => {
	expect(getCacheStoreName('areas')).toMatchInlineSnapshot(`"areaCache"`)
})

test('getCacheStoreName throws an error on unexpected values', () => {
	expect(() =>
		// $FlowExpectedError
		getCacheStoreName('invalid'),
	).toThrowErrorMatchingInlineSnapshot(
		`"\\"invalid\\" is not a valid store type"`,
	)
})
