import {expect} from 'chai'
import splitParagraph from '../split-paragraph'

describe('splitParagraph', () => {
	it('returns and array of the words in the string', () => {
		let str = 'I am words'
		expect(splitParagraph(str)).to.eql(['i', 'am', 'words'])
	})

	it('lower-cases the passed-in string', () => {
		let str = 'I AM UPPERCASE'
		expect(splitParagraph(str)).to.eql(['i', 'am', 'uppercase'])
	})

	it('removes accents and special chars', () => {
		let str = '   I am a string  , with punctuation  & spécial   chars.    '
		expect(splitParagraph(str)).to.eql(['i', 'am', 'a', 'string', 'with', 'punctuation', 'special', 'chars'])
	})

	it('removes punctuation', () => {
		let str = '1, 2, & 3'
		expect(splitParagraph(str)).to.eql(['1', '2', '3'])
		let other = '1, 2, and 3'
		expect(splitParagraph(other)).to.eql(['1', '2', 'and', '3'])
	})

	it('keeps numbers', () => {
		let str = '1 2 3'
		expect(splitParagraph(str)).to.eql(['1', '2', '3'])
	})

	it('trims the strings', () => {
		let str = '   I    '
		expect(splitParagraph(str)).to.eql(['i'])
	})
})
