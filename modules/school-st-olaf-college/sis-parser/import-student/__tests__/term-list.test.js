import { loadHtml } from './import-student.support'
import { parseHtml } from '../../parse-html'
import { extractTermList } from '../term-list'

describe('extractTermList', () => {
    it('returns the list of terms', () => {
        const html = loadHtml('term-20151')
        const actual = extractTermList(html)
        const expected = [
            20153,
            20152,
            20151,
            20143,
            20142,
            20141,
            20133,
            20132,
            20131,
            20123,
            20122,
            20121,
            20119,
        ]
        expect(actual).toEqual(expected)
    })

    it('returns an empty list when no term list selectors are found', () => {
        const actual = extractTermList(parseHtml(''))
        const expected = []
        expect(actual).toEqual(expected)
    })

    it('returns an empty list when no term options are found', () => {
        const actual = extractTermList(
            parseHtml('<select name=searchyearterm></select>')
        )
        const expected = []
        expect(actual).toEqual(expected)
    })
})
