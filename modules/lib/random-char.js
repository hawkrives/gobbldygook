'use strict'

/**
 * @flow
 * A function to return a random character, modified from
 * stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
 */

function randomChar(): string {
	return Math.random().toString(36).slice(2, 3)
}

module.exports.randomChar = randomChar
