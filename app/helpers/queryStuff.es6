import * as _ from 'lodash'

// We should build lists of valid inputs!
// Like, 'these are the valid departments' and 'these are the valid professors'

var semesters = {
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

var department_mapping = {
	'american conversation': 'AMCON',
	'american conversations': 'AMCON',
	'asian studies': 'ASIAN',
	'computer science': 'CSCI',
	'cs': 'CSCI',
	'physics': 'PHYS',
	'religion': 'REL',
	'ar': 'ART',
	'as': 'ASIAN',
	'bi': 'BIO',
	'ch': 'CHEM',
	'ec': 'ECON',
	'es': 'ENVST',
	'hi': 'HIST',
	'mu': 'MUSIC',
	'ph': 'PHIL',
	'ps': 'PSCI',
	're': 'REL',
	'sa': 'SOAN',
	'compsci': 'CSCI',
}

var keyword_mappings = {
	'departments': 'depts',
	'department': 'depts',
	'dept': 'depts',
	'sem': 'semester',
	'num': 'number',
	'name': 'title',
	'gereq': 'geneds',
	'gereqs': 'geneds',
	'ges': 'geneds',
	'gened': 'geneds'
}

var gereq_mapping = {
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
	'writing': 'WRI',
	'bible': 'BTS-B',
	'biblical': 'BTS-B',
	'bible studies': 'BTS-T',
	'biblical studies': 'BTS-T',
	'theology': 'BTS-T',
	'theological': 'BTS-T',
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
	'gym': 'SPM',
	'studies in human behavior and society': 'HBS',
	'ethical issues and normative perspectives': 'EIN',
	'ethical issues': 'EIN',
	'ethics': 'EIN',
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

function process(queryString) {
	var rex = /(\b\w*?\b):/g

	// Split apart the string into an array
	var matches = queryString.split(rex)

	// Remove extra whitespace and remove empty strings
	var cleaned = _(matches)
		.map((m) => m.trim())
		.filter(notEmptyString)
		.value()

	// Grab the keys and values from the lists
	var values = _.filter(cleaned, oddIndex)
	var keys = _.filter(cleaned, evenIndex)

	// Process the keys, to clean them up somewhat
	keys = _.map(keys, (key) => {
		key = key.toLowerCase()
		if (key.indexOf('_') !== 0)
			key = keyword_mappings[key] || key;
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
				val = department_mapping[val] || val.toUpperCase();
			}

			else if (key === 'geneds') {
				val = val.toLowerCase()
				val = gereq_mapping[val] || val.toUpperCase()
			}

			else if (key === 'semester') {
				val = val.toLowerCase()
				val = semesters[val] || parseInt(val, 10);
			}

			else if (key === 'year')
				val = parseInt(val, 10)
			else if (key === 'term')
				val = parseInt(val, 10)
			else if (key === 'level')
				val = parseInt(val, 10)
			else if (key === 'number')
				val = parseInt(val, 10)

			return val;
		})

		if (organized.length > 1 && organized[0].indexOf('$') !== 0) {
			organized.unshift('$AND')
		}

		return organized
	})

	return grouped
}

var s1 = 'dept: Computer Science  dept: Asian Studies  name: Parallel  level: 300  year: $OR year:2013 year: 2014'

var s2 = 'dept: ASIAN  Dept: Religion  title: "Japan*"  LEVEL: 200  year: 2014  semester: $OR  semester: 3  semester: 1'

var s3 = 'department: American Conversations  name: Independence  year: 2014  time: Tuesdays after 12'

var s4 = 'ges: $AND  geneds: history of western culture gened: HBS  semester: Spring  year: 2014'

console.log(process(s1))
console.log(process(s2))
console.log(process(s3))
console.log(process(s4))
