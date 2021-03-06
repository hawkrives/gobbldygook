// @flow

import flatten from 'lodash/flatten'
import mapValues from 'lodash/mapValues'
import toPairs from 'lodash/toPairs'
import unzip from 'lodash/unzip'
import uniq from 'lodash/uniq'

import {quacksLikeDeptNum, splitDeptNum} from '@gob/school-st-olaf-college'

import {partitionByIndex, splitParagraph, zipToObjectWithArrays} from '@gob/lib'

import departmentMapping from 'sto-course-related-data/handmade/to_department_abbreviations.json'
import gereqMapping from 'sto-course-related-data/handmade/to_gereq_abbreviations.json'

let semesters = {
	fall: 1,
	interim: 2,
	'j-term': 2,
	jterm: 2,
	j: 2,
	spring: 3,
	'summer 1': 4,
	summer1: 4,
	early: 4,
	'early summer': 4,
	'summer session 1': 4,
	'summer session 2': 5,
	late: 5,
	'late summer': 5,
	summer2: 5,
	'summer 2': 5,
	summers: ['$OR', 4, 5],
}

let keywordMappings = {
	day: 'times',
	days: 'times',
	department: 'department',
	departments: 'department',
	dept: 'department',
	depts: 'department',
	ge: 'gereqs',
	gened: 'gereqs',
	geneds: 'gereqs',
	gereq: 'gereqs',
	ges: 'gereqs',
	inst: 'instructors',
	instructor: 'instructors',
	locations: 'location',
	num: 'number',
	place: 'location',
	places: 'location',
	prof: 'instructors',
	profs: 'instructors',
	professor: 'instructors',
	professors: 'instructors',
	sem: 'semester',
	teacher: 'instructors',
	teachers: 'instructors',
	time: 'times',
}

let gereqs = new Set([
	'ALS-A',
	'ALS-L',
	'AQR',
	'BTS-B',
	'BTS-T',
	'EIN',
	'FOL-C',
	'FOL-F',
	'FOL-G',
	'FOL-J',
	'FOL-K',
	'FOL-L',
	'FOL-N',
	'FOL-R',
	'FOL-S',
	'FYW',
	'HBS',
	'HWC',
	'IST',
	'MCD',
	'MCG',
	'ORC',
	'SED',
	'SPM',
	'WRI',
])

function organizeValues([key, values], words = false, profWords = false) {
	let organizedValues = values.map(val => {
		// handle $OR and $AND and other boolean operators
		if (typeof val === 'string' && /^\$/.test(val)) {
			return val.toUpperCase()
		}

		switch (key) {
			// handle the numeric values
			case 'credits':
				return parseFloat(val)
			case 'year':
			case 'level':
			case 'term':
			case 'number':
			case 'groupid':
			case 'clbid':
			case 'crsid':
				return parseInt(val, 10)
			// handle the lookup values
			case 'department':
				val = val.toLowerCase()
				return departmentMapping[val] || val.toUpperCase()
			case 'gereqs':
				val = val.toLowerCase()
				return gereqMapping[val] || val.toUpperCase()
			case 'semester':
				val = val.toLowerCase()
				return semesters[val] || parseInt(val, 10)
			// handle the string values
			case 'deptnum':
			case 'times':
			case 'locations':
				return val.toUpperCase()
			// handle the boolean values
			case 'pf':
				return val === 'true' ? true : false
			// handle the multi-word values
			case 'instructors':
				if (profWords) {
					key = 'profWords'
					return splitParagraph(val)
				}
				return val.trim()
			case 'title':
			case 'name':
			case 'notes':
			case 'description':
				if (words) {
					key = 'words'
					return splitParagraph(val)
				}
				return val.trim()
			case 'words':
				return splitParagraph(val)
			default:
				return val.trim()
		}
	})

	return [key, flatten(organizedValues)]
}

export function buildQueryFromString(
	queryString: string = '',
	opts: {words?: boolean, profWords?: boolean} = {},
) {
	queryString = queryString.trim()
	if (queryString.endsWith(':')) {
		queryString = queryString.substring(0, queryString.length - 1)
	}

	let rex = /(\b\w*?\b):/g

	// The {index} object is there to emulate the one property I
	// expect from a RegExp.
	// If the regex fails, we grab the string through the end
	// and build the object from what we assume to be the title.
	let rexTested = rex.exec(queryString) || {index: queryString.length}
	let stringThing = queryString.substr(0, rexTested.index)
	queryString = queryString.substring(rexTested.index)

	// Split apart the string into an array
	let matches = queryString.split(rex)
	;(matches: Array<string>)

	// Remove extra whitespace and remove empty strings
	let cleaned = matches.map(s => s.trim()).filter(s => s !== '')

	// Grab the keys and values from the lists
	let [keys, values] = partitionByIndex(cleaned)
	;(keys: Array<string>)
	;(values: Array<mixed>)

	if (stringThing && quacksLikeDeptNum(stringThing)) {
		let deptnum = splitDeptNum(stringThing, true)
		if (deptnum) {
			let {department, number, section} = deptnum

			keys.push('department')
			values.push(department)

			keys.push('number')
			values.push(number)

			if (section) {
				keys.push('section')
				values.push(section)
			}
		}
	} else if (gereqs.has(stringThing.toUpperCase())) {
		keys.push('gereqs')
		values.push(stringThing)
	} else if (stringThing) {
		keys.push('words')
		values.push(stringThing)
	}

	// Process the keys, to clean them up somewhat
	keys = keys.map(key => {
		key = key.toLowerCase()
		/* istanbul ignore else */
		if (!key.startsWith('_')) {
			key = keywordMappings[key] || key
		}
		return key
	})

	// Group the [keys, vals] into an object, with arrays for each value
	let zipped = zipToObjectWithArrays(keys, values)

	// Perform initial cleaning of the values, dependent on the keys
	let paired = unzip(
		toPairs(zipped).map(kvpairs =>
			organizeValues(kvpairs, opts.words, opts.profWords),
		),
	)

	let organized = zipToObjectWithArrays(...paired) // spread the [k, v] pairs into the arguments properly

	return mapValues(organized, val => {
		// flatten the results list
		val = flatten(val)
		// remove duplicates from the results list
		val = uniq(val)

		// if it's a single-value or empty value, we don't need to do anything else
		if (val.length === 0 || val.length === 1) {
			return val
		}

		// find the first boolean value in the thing
		let booleanIndex = val.findIndex(
			v => typeof v === 'string' && v.startsWith('$'),
		)
		let includesBoolean = booleanIndex !== -1
		let startsWithBoolean = booleanIndex === 0

		// if it's a multi-value thing and has a boolean, but it's not at the start,
		// move it to the front.
		if (includesBoolean && !startsWithBoolean) {
			let [bool] = val.splice(booleanIndex, 1)
			val.unshift(bool)
		}

		// if it didn't have a boolean at all, stick $AND at the front
		if (val.length > 1 && !includesBoolean) {
			val.unshift('$AND')
		}

		return val
	})
}
