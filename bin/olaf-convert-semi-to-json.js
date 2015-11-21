/* eslint strict: 0 */
'use strict'

const fs = require('graceful-fs')
const nomnom = require('nomnom')
const partition = require('lodash/collection/partition')
const unzip = require('lodash/array/unzip')
const first = require('lodash/array/first')

const args = nomnom()
	.option('file', {position: 0, required: true, list: false, help: 'The semicolon-separated files from the registrar to load'})
	.parse()

const input = fs.readFileSync(args.file, 'utf-8')

let splitten = input
	.split(';')
	.filter(s => s && s.trim().length)

let indexOfFirstCourse = splitten.findIndex(item => /\d{5,6}/.test(item))

let onlyCoursesAndGereqs = unzip(
	partition(
		splitten.slice(indexOfFirstCourse),
		(_, i) => i % 2 === 0))

let onlyMajors = splitten.slice(0, indexOfFirstCourse)

// console.log(onlyMajors)
// console.log(onlyCoursesAndGereqs)

console.log(JSON.stringify({
	studies: onlyMajors.map(m => ({type: 'major', name: m, revision: 'latest'})),
	clbids: onlyCoursesAndGereqs.map(cAndGe => first(cAndGe)).map(c => Number(c)),
}, null, 2))
