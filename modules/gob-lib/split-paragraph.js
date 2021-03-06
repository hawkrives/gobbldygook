// @flow

import words from 'lodash/words'
import deburr from 'lodash/deburr'

export function splitParagraph(string: string = ''): Array<string> {
	let lowercase = string.toLowerCase()

	// removes accents and such from ascii chars
	let noAccents = deburr(lowercase)

	// returns just the words, stripping extra spaces and symbols
	return words(noAccents)
}
