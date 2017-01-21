// @flow
// Usage: ./bin/olaf-convert-semi-to-json ./playground/olaf-semicolons/sample-1.txt > blank.student
//        ./bin/olaf-find-student-courses blank.student

/* eslint strict: 0 */
'use strict'

const fs = require('graceful-fs')
const nomnom = require('nomnom')
const partition = require('lodash/partition')
const unzip = require('lodash/unzip')
const head = require('lodash/head')

const args = nomnom()
	.option('file', {
		position: 0,
		required: true,
		list: false,
		help: 'The semicolon-separated files from the registrar to load',
	})
	.parse()

const input = fs.readFileSync(args.file, 'utf-8')

let splitten = input.split(';')

// console.log(splitten)

let indexOfFirstCourse = splitten.findIndex(item => /\d{5,6}/.test(item))

let onlyCoursesAndGereqs = unzip(
	partition(
		splitten.slice(indexOfFirstCourse),
		(_, i) => i % 2 === 0))

let onlyMajors = splitten.slice(0, indexOfFirstCourse)

console.log(JSON.stringify({
	studies: onlyMajors.map(m => ({type: 'major', name: m})),
	clbids: onlyCoursesAndGereqs.map(cAndGe => head(cAndGe)).filter(s => s.trim().length).map(c => Number(c)),
}, null, 2))
