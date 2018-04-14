/* eslint-env jest */
// @flow

import parseData from '../parse-data'

test('parseData can parse json', () => {
    expect(parseData('{"foo": 2}', 'courses')).toMatchSnapshot()
})

test('parseData can parse yaml', () => {
    expect(parseData('foo: 2', 'areas')).toMatchSnapshot()
})

test("parseData returns a blank object if it can't parse", () => {
    // $FlowFixMe
    expect(parseData('foo: 2', 'other')).toMatchSnapshot()
    expect(parseData('invalid', 'courses')).toMatchSnapshot()
    expect(parseData('- invalid: yaml:', 'areas')).toMatchSnapshot()
})
