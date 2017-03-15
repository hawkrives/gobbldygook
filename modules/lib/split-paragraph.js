// @flow
'use strict'
const words = require('lodash/words')
const deburr = require('lodash/deburr')

function splitParagraph(string: string=''): string {
    let lowercase = string.toLowerCase()

	// removes accents and such from ascii chars
    let noAccents = deburr(lowercase)

	// returns just the words, stripping extra spaces and symbols
    return words(noAccents)
}

module.exports.splitParagraph = splitParagraph
