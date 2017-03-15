// @flow
'use strict'
const kebabCase = require('lodash/kebabCase')

function makeAreaSlug(name: string): string {
	return kebabCase((name || '').replace("'", '')).toLowerCase()
}

module.exports.makeAreaSlug = makeAreaSlug
