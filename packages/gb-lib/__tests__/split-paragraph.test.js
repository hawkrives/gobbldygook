import test from 'ava'
import splitParagraph from '../split-paragraph'

test('returns and array of the words in the string', t => {
	let str = 'I am words'
	t.deepEqual(splitParagraph(str), ['i', 'am', 'words'])
})

test('lower-cases the passed-in string', t => {
	let str = 'I AM UPPERCASE'
	t.deepEqual(splitParagraph(str), ['i', 'am', 'uppercase'])
})

test('removes accents and special chars', t => {
	let str = '   I am a string  , with punctuation  & spécial   chars.    '
	t.deepEqual(splitParagraph(str), ['i', 'am', 'a', 'string', 'with', 'punctuation', 'special', 'chars'])
})

test('removes punctuation', t => {
	let str = '1, 2, & 3'
	t.deepEqual(splitParagraph(str), ['1', '2', '3'])
	let other = '1, 2, and 3'
	t.deepEqual(splitParagraph(other), ['1', '2', 'and', '3'])
})

test('keeps numbers', t => {
	let str = '1 2 3'
	t.deepEqual(splitParagraph(str), ['1', '2', '3'])
})

test('trims the strings', t => {
	let str = '   I    '
	t.deepEqual(splitParagraph(str), ['i'])
})
