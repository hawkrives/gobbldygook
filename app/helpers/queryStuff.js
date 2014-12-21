import * as _ from 'lodash'
import * as courseRelatedData from 'sto-courses'

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

let departmentMapping = courseRelatedData.departmentNameToAbbr
let gereqMapping = courseRelatedData.gereqTitleToAbbr

let keywordMappings = {
	departments: 'depts',
	department: 'depts',
	dept: 'depts',
	semester: 'sem',
	number: 'num',
	name: 'title',
	ge: 'gereqs',
	gereq: 'gereqs',
	ges: 'gereqs',
	gened: 'gereqs',
	geneds: 'gereqs',
	prof: 'profs',
	instructor: 'profs',
	instructors: 'profs',
	inst: 'profs',
	time: 'times',
	day: 'times',
	days: 'times',
	location: 'places',
	locations: 'places',
	place: 'places',
}

let evenIndex = (value, index) => index % 2 === 0;
let oddIndex  = (value, index) => index % 2 === 1;
let notEmptyString = (value) => value.length > 0;


let zipToObjectWithArrays = (keys, vals) => {
	let arr = _.zip(keys, vals)
	return _(arr).reduce((obj, propKey) => {
		if (_.has(obj, propKey[0]))
			obj[propKey[0]].push(propKey[1]);
		else
			obj[propKey[0]] = [propKey[1]];

		return obj;
	}, {});
}

function buildQueryFromString(queryString) {
	let rex = /(\b\w*?\b):/g

	// The {index} object is there to emulate the one property I expect from a RegExp.
	// If the regex fails, we grab the string through the end and build the object from what we assume to be the title.
	let rexTested = rex.exec(queryString) || {index: queryString.length}
	let stringThing = queryString.substr(0, rexTested.index)
	queryString = queryString.substring(rexTested.index)

	// Split apart the string into an array
	let matches = queryString.split(rex)

	// Remove extra whitespace and remove empty strings
	let cleaned = _(matches)
		.map((m) => m.trim())
		.filter(notEmptyString)
		.value()


	// Grab the keys and values from the lists
	let keys = _.filter(cleaned, evenIndex)
	let values = _.filter(cleaned, oddIndex)

	if (stringThing) {
		keys.push('title')
		values.push(stringThing.trim())
	}

	// Process the keys, to clean them up somewhat
	keys = _.map(keys, (key) => {
		key = key.toLowerCase()
		if (key.indexOf('_') !== 0)
			key = keywordMappings[key] || key;
		return key;
	})

	// Group the [keys, vals] into an object, with arrays for each value
	let zipped = zipToObjectWithArrays(keys, values)

	// Perform initial cleaning of the values, dependent on the keys
	let grouped = _.mapValues(zipped, (vals, key) => {
		let organized = _.map(vals, (val) => {
			if (val.indexOf('$') === 0)
				return val.toUpperCase()

			if (key === 'depts') {
				val = val.toLowerCase()
				val = departmentMapping[val] || val.toUpperCase();
			}

			else if (key === 'gereqs') {
				val = val.toLowerCase()
				val = gereqMapping[val] || val.toUpperCase()
			}

			else if (key === 'deptnum') {
				val = val.toUpperCase()
			}

			else if (key === 'sem') {
				val = val.toLowerCase()
				val = semesters[val] || parseInt(val, 10);
			}

			else if (key === 'profs') {
				val = val.toUpperCase()
			}

			else if (key === 'times' || key === 'places') {
				val = val.toLowerCase()
			}

			else if (_.contains(['year', 'term', 'level', 'num'], key)) {
				val = parseInt(val, 10)
			}

			return val;
		})

		if (organized.length > 1 && organized[0].indexOf('$') !== 0) {
			organized.unshift('$AND')
		}

		return organized
	})

	return grouped
}

export default buildQueryFromString
