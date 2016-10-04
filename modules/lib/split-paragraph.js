import {words} from 'lodash'
import {deburr} from 'lodash'

export function splitParagraph(string='') {
	let lowercase = string.toLowerCase()

	// removes accents and such from ascii chars
	let noAccents = deburr(lowercase)

	// returns just the words, stripping extra spaces and symbols
	return words(noAccents)
}
