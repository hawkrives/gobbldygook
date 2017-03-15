import { customParser } from './parse-hanson-string.support'
const parse = customParser({ allowedStartRules: ['Occurrence'] })

describe('OccurrenceExpression', () => {
    it('requires a course to check for occurrences of', () => {
        expect(parse('one occurrence of CSCI 121')).toMatchSnapshot()
    })
})
