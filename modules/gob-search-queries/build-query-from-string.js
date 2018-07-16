// @flow

import flatten from 'lodash/flatten'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import toPairs from 'lodash/toPairs'
import unzip from 'lodash/unzip'

import {quacksLikeDeptNum, splitDeptNum} from '@gob/school-st-olaf-college'

import {partitionByIndex, splitParagraph, zipToObjectWithArrays} from '@gob/lib'

let semesters = {
	fall: 'FA',
	interim: 'WI',
	'j-term': 'WI',
	jterm: 'WI',
	j: 'WI',
	winter: 'WI',
	spring: 'SP',
}

let keywordMappings = {
	day: 'times',
	days: 'times',
	department: 'subject',
	dept: 'subject',
	depts: 'subject',
	ge: 'requirements',
	gened: 'requirements',
	geneds: 'requirements',
	gereq: 'requirements',
	ges: 'requirements',
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
	requirement: 'requirements',
	sem: 'semester',
	teacher: 'instructors',
	teachers: 'instructors',
	time: 'times',
	title: 'name',
	description: 'summary',
	notes: 'comments',
}

function organizeValues([key, values], words = false, profWords = false) {
	let intKeys = ['year'/* , 'term', 'level', 'number', 'groupid', 'clbid', 'crsid' */]
	let strKeys = [/* 'title', */ 'name', 'comments', /* 'notes', 'description', 'words' */]

	let organizedValues = map(values, val => {
		// handle the numeric values first
		if (key === 'credits') {
			val = parseFloat(val)
		} else if (intKeys.includes(key)) {
			val = parseInt(val, 10)
		}

		if (typeof val !== 'string') {
			return val
		}

		// now deal with the strings
		if (val.startsWith('$')) {
			return val.toUpperCase()
		} else if (key === 'subject') {
			val = val.toUpperCase()
		} else if (key === 'requirements') {
			val = val.toUpperCase()
		} else if (key === 'deptnum') {
			val = val.toUpperCase()
		} else if (key === 'semester') {
			val = val.toLowerCase()
			val = semesters[val] || val.toUpperCase()
		} else if (key === 'instructors' && profWords) {
			val = splitParagraph(val)
			key = 'profWords'
		} else if (key === 'times' || key === 'locations') {
			val = val.toUpperCase()
		} else if (key === 'pf') {
			val = val === 'true'
		} else if (strKeys.includes(key)) {
			if (words || key === 'words') {
				val = splitParagraph(val)
				key = 'words'
			} else {
				val = val.trim()
			}
		}

		return val
	})

	if (organizedValues.length && Array.isArray(organizedValues[0])) {
		organizedValues = flatten(organizedValues)
	}

	return [key, organizedValues]
}

export function buildQueryFromString(queryString: string = '', opts: {words?: boolean, profWords?: boolean} = {}) {
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

	// Remove extra whitespace and remove empty strings
	let cleaned = matches.map(s => s.trim()).filter(s => s.length > 0)

	// Grab the keys and values from the lists
	let [keys, values] = partitionByIndex(cleaned)

	if (stringThing && quacksLikeDeptNum(stringThing)) {
		let {departments, number, section} = splitDeptNum(stringThing)
		// let deptnum = buildDeptNum({subject: departments[0], number})
		keys.push('subject')
		values.push(departments[0])
		keys.push('number')
		values.push(number)
		if (section) {
			keys.push('section')
			values.push(section)
		}
		// values.push(deptnum)
		// console.log(deptnum)
	} else if (stringThing) {
		keys.push('title')
		values.push(stringThing)
	}

	// Process the keys, to clean them up somewhat
	keys = map(keys, key => {
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

	let retval = mapValues(organized, val => {
		// flatten the results list
		val = flatten(val)

		// if it's a multi-value thing and doesn't include a boolean yet, default to $AND
		if (val.length > 1 && (typeof val[0] !== 'string' || !val[0].startsWith('$'))) {
			val.unshift('$AND')
		}

		return val
	})

	return retval
}
