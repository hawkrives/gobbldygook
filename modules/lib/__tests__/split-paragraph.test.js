import { splitParagraph } from '../split-paragraph'

describe('splitParagraph', () => {
    it('returns and array of the words in the string', () => {
        let str = 'I am words'
        expect(splitParagraph(str)).toEqual(['i', 'am', 'words'])
    })

    it('lower-cases the passed-in string', () => {
        let str = 'I AM UPPERCASE'
        expect(splitParagraph(str)).toEqual(['i', 'am', 'uppercase'])
    })

    it('removes accents and special chars', () => {
        let str =
            '   I am a string  , with punctuation  & spécial   chars.    '
        expect(splitParagraph(str)).toEqual([
            'i',
            'am',
            'a',
            'string',
            'with',
            'punctuation',
            'special',
            'chars',
        ])
    })

    it('removes punctuation', () => {
        let str = '1, 2, & 3'
        expect(splitParagraph(str)).toEqual(['1', '2', '3'])
        let other = '1, 2, and 3'
        expect(splitParagraph(other)).toEqual(['1', '2', 'and', '3'])
    })

    it('keeps numbers', () => {
        let str = '1 2 3'
        expect(splitParagraph(str)).toEqual(['1', '2', '3'])
    })

    it('trims the strings', () => {
        let str = '   I    '
        expect(splitParagraph(str)).toEqual(['i'])
    })

    it('defaults to processing an empty string', () => {
        expect(splitParagraph()).toEqual([])
    })
})
