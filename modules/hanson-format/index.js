'use strict'
const { expandDepartment, normalizeDepartment } = require('./convert-department')
const { enhanceHanson } = require('./enhance-hanson')
const { makeAreaSlug } = require('./make-area-slug')
const { parse } = require('./parse-hanson-string')

module.exports = {
	expandDepartment,
	normalizeDepartment,
	enhanceHanson,
	makeAreaSlug,
	parse,
}
