import * as _ from 'lodash'

// We should build lists of valid inputs!
// Like, 'these are the valid departments' and 'these are the valid professors'

var semesters = {
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

var departmentMapping = {
	'american con': 'AMCON',
	'american conversation': 'AMCON',
	'american conversations': 'AMCON',
	'asian studies': 'ASIAN',
	'computer science': 'CSCI',
	'biomolecular studies': 'BMOLS',
	bmol: 'BMOLS',
	grcon: 'GCON',
	greatcon: 'GCON',
	'great con': 'GCON',
	'great conversation': 'GCON',
	'great conversations': 'GCON',
	cs: 'CSCI',
	physics: 'PHYS',
	religion: 'REL',
	ar: 'ART',
	as: 'ASIAN',
	bi: 'BIO',
	ch: 'CHEM',
	ec: 'ECON',
	es: 'ENVST',
	hi: 'HIST',
	mu: 'MUSIC',
	ph: 'PHIL',
	ps: 'PSCI',
	re: 'REL',
	sa: 'SOAN',
	wri: 'WRIT',
	compsci: 'CSCI',
}

var keywordMappings = {
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

var gereqMapping = {
	'history of western culture': 'HWC',
	'historical studies in western culture': 'HWC',
	'artistic studies': 'ALS-A',
	'artistic and literary studies - art': 'ALS-A',
	'literary studies': 'ALS-L',
	'artistic and literary studies - literature': 'ALS-L',
	'multicultural domestic studies': 'MCD',
	'multicultural global studies': 'MCG',
	'integrated scientific topics': 'IST',
	'scientific exploration and discovery': 'SED',
	'first-year writing': 'FYW',
	'writing in context': 'WRI',
	writing: 'WRI',
	bible: 'BTS-B',
	biblical: 'BTS-B',
	'bible studies': 'BTS-T',
	'biblical studies': 'BTS-T',
	theology: 'BTS-T',
	theological: 'BTS-T',
	'theology studies': 'BTS-T',
	'theological studies': 'BTS-T',
	'biblical and theological studies - bible': 'BTS-B',
	'biblical and theological studies - biblical': 'BTS-B',
	'biblical and theological studies - theology': 'BTS-T',
	'biblical and theological studies - theological': 'BTS-T',
	'foreign language': 'FOL',
	'oral communication': 'ORC',
	'abstract and quantitative reasoning': 'AQR',
	'studies in physical movement': 'SPM',
	gym: 'SPM',
	'studies in human behavior and society': 'HBS',
	'ethical issues and normative perspectives': 'EIN',
	'ethical issues': 'EIN',
	ethics: 'EIN',
}

var evenIndex = (value, index) => index % 2 === 0;
var oddIndex  = (value, index) => index % 2 === 1;
var notEmptyString = (value) => value.length > 0;


var zipToObjectWithArrays = (keys, vals) => {
	let arr = _.zip(keys, vals)
	return _(arr).reduce(function(obj, propKey) {
		if (_.has(obj, propKey[0]))
			obj[propKey[0]].push(propKey[1]);
		else
			obj[propKey[0]] = [propKey[1]];

		return obj;
	}, {});
}

function buildQueryFromString(queryString) {
	var rex = /(\b\w*?\b):/g

	// The {index} object is there to emulate the one property I expect from a RegExp.
	// If the regex fails, we grab the string through the end and build the object from what we assume to be the title.
	let rexTested = rex.exec(queryString) || {index: queryString.length}
	let stringThing = queryString.substr(0, rexTested.index)
	queryString = queryString.substring(rexTested.index)

	// Split apart the string into an array
	var matches = queryString.split(rex)

	// Remove extra whitespace and remove empty strings
	var cleaned = _(matches)
		.map((m) => m.trim())
		.filter(notEmptyString)
		.value()


	// Grab the keys and values from the lists
	var keys = _.filter(cleaned, evenIndex)
	var values = _.filter(cleaned, oddIndex)

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
	var zipped = zipToObjectWithArrays(keys, values)

	// Perform initial cleaning of the values, dependent on the keys
	var grouped = _.mapValues(zipped, (vals, key) => {
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
