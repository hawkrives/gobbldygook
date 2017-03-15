'use strict'
const { selectAll } = require('css-select')
const map = require('lodash/map')
const filter = require('lodash/filter')
const uniq = require('lodash/uniq')

module.exports.extractStudentIds = extractStudentIds
function extractStudentIds(dom) {
	let idElements = selectAll('[name=stnum]', dom)
	return uniq(map(filter(idElements, el => el), el => Number(el.attribs.value)))
}
