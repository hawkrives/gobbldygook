import {endsWith} from 'lodash'
import {filter} from 'lodash'
import {flatten} from 'lodash'
import {includes} from 'lodash'
import {isArray} from 'lodash'
import {map} from 'lodash'
import {mapValues} from 'lodash'
import {startsWith} from 'lodash'
import {toPairs} from 'lodash'
import {trim} from 'lodash'
import {unzip} from 'lodash'

import {
	quacksLikeDeptNum,
	splitDeptNum,
	buildDeptNum,
} from 'modules/schools/stolaf'

import {
	partitionByIndex,
	splitParagraph,
	zipToObjectWithArrays,
} from 'modules/lib'

import departmentMapping from 'sto-course-related-data/handmade/to_department_abbreviations.json'
import gereqMapping from 'sto-course-related-data/handmade/to_gereq_abbreviations.json'

let semesters = {
	'fall': 1,
	'interim': 2,
	'j-term': 2,
	'jterm': 2,
	'j': 2,
	'spring': 3,
	'summer 1': 4,
	'summer1': 4,
	'early': 4,
	'early summer': 4,
	'summer session 1': 4,
	'summer session 2': 5,
	'late': 5,
	'late summer': 5,
	'summer2': 5,
	'summer 2': 5,
	'summers': ['$OR', 4, 5],
}

let keywordMappings = {
	'day': 'times',
	'days': 'times',
	'department': 'departments',
	'dept': 'departments',
	'depts': 'departments',
	'ge': 'gereqs',
	'gened': 'gereqs',
	'geneds': 'gereqs',
	'gereq': 'gereqs',
	'ges': 'gereqs',
	'inst': 'instructors',
	'instructor': 'instructors',
	'locations': 'location',
	'num': 'number',
	'place': 'location',
	'places': 'location',
	'prof': 'instructors',
	'profs': 'instructors',
	'professor': 'instructors',
	'professors': 'instructors',
	'sem': 'semester',
	'teacher': 'instructors',
	'teachers': 'instructors',
	'time': 'times',
}

function organizeValues([key, values], words=false, profWords=false) {
	let organizedValues = map(values, val => {
		if (startsWith(val, '$')) {
			return val.toUpperCase()
		}

		else if (key === 'departments') {
			val = val.toLowerCase()
			val = departmentMapping[val] || val.toUpperCase()
		}

		else if (key === 'gereqs') {
			val = val.toLowerCase()
			val = gereqMapping[val] || val.toUpperCase()
		}

		else if (key === 'deptnum') {
			val = val.toUpperCase()
		}

		else if (key === 'semester') {
			val = val.toLowerCase()
			val = semesters[val] || parseInt(val, 10)
		}

		else if (key === 'instructors') {
			if (profWords) {
				val = splitParagraph(val)
				key = 'profWords'
			}
		}

		else if (key === 'times' || key === 'locations') {
			val = val.toUpperCase()
		}

		else if (key === 'pf') {
			val = (val === 'true')
		}

		else if (key === 'credits') {
			val = parseFloat(val)
		}

		else if (includes(['year', 'term', 'level', 'number', 'groupid', 'clbid', 'crsid'], key)) {
			val = parseInt(val, 10)
		}

		else if (includes(['title', 'name', 'notes', 'description', 'words'], key)) {
			if (words || key === 'words') {
				val = splitParagraph(val)
				key = 'words'
			}
			else {
				val = trim(val)
			}
		}

		return val
	})

	if (organizedValues.length && isArray(organizedValues[0])) {
		organizedValues = flatten(organizedValues)
	}

	return [key, organizedValues]
}


export function buildQueryFromString(queryString='', opts={}) {
	queryString = trim(queryString)
	if (endsWith(queryString, ':')) {
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
	let cleaned = filter(map(matches, trim), str => str.length > 0)

	// Grab the keys and values from the lists
	let [keys, values] = partitionByIndex(cleaned)

	if (stringThing && quacksLikeDeptNum(stringThing)) {
		let {departments, number} = splitDeptNum(stringThing)
		let deptnum = buildDeptNum({departments, number})
		keys.push('deptnum')
		values.push(deptnum)
	}
	else if (stringThing) {
		keys.push('title')
		values.push(stringThing)
	}

	// Process the keys, to clean them up somewhat
	keys = map(keys, key => {
		key = key.toLowerCase()
		/* istanbul ignore else */
		if (!startsWith(key, '_')) {
			key = keywordMappings[key] || key
		}
		return key
	})

	// Group the [keys, vals] into an object, with arrays for each value
	let zipped = zipToObjectWithArrays(keys, values)

	// Perform initial cleaning of the values, dependent on the keys
	let paired = unzip(map(toPairs(zipped), kvpairs => organizeValues(kvpairs, opts.words, opts.profWords)))

	let organized = zipToObjectWithArrays(...paired) // spread the [k, v] pairs into the arguments properly

	return mapValues(organized, val => {
		// flatten the results list
		val = flatten(val)

		// if it's a multi-value thing and doesn't include a boolean yet, default to $AND
		if (val.length > 1 && !startsWith(val[0], '$')) {
			val.unshift('$AND')
		}

		return val
	})
}
