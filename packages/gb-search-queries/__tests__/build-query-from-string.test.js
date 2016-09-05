import test from 'ava'
import buildQueryFromString from '../build-query-from-string'

test('builds a query string with multiple keys into a query object', t => {
	let query = 'dept: Computer Science  dept: Asian Studies  name: Parallel  level: 300  year: $OR year:2013 year: 2014'
	let expectedResult = {
		depts: ['$AND', 'CSCI', 'ASIAN'],
		name: ['Parallel'],
		level: [300],
		year: ['$OR', 2013, 2014],
	}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('builds a query string with variable-case keys into a query object', t => {
	let query = 'dept: ASIAN  Dept: Religion  title: "Japan*"  LEVEL: 200  year: 2014  semester: $OR  semester: 3  semester: 1'
	let expectedResult = {
		depts: ['$AND', 'ASIAN', 'REL'],
		title: ['"Japan*"'],
		level: [200],
		year: [2014],
		semester: ['$OR', 3, 1],
	}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('builds a query string even with somewhat unconventional input', t => {
	let query = 'department: American Conversations  name: Independence  year: 2014  time: Tuesdays after 12'
	let expectedResult = {
		depts: ['AMCON'],
		name: ['Independence'],
		year: [2014],
		times: ['TUESDAYS AFTER 12'],
	}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('builds a query string while deduplicating synonyms of keys', t => {
	let query = 'ges: $AND  geneds: history of western culture gened: HBS  semester: Spring  year: 2014'
	let expectedResult = {
		gereqs: ['$AND', 'HWC', 'HBS'],
		semester: [3],
		year: [2014],
	}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('builds a query string even with no keys', t => {
	let query = 'History of Asia'
	let expectedResult = {
		words: ['$AND', 'history', 'of', 'asia'],
	}

	t.deepEqual(buildQueryFromString(query, {words: true}), expectedResult)
})

test('can also search for deptnums even with no keys', t => {
	let query = 'ASIAN 220'
	let expectedResult = {
		deptnum: ['ASIAN 220'],
	}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('can also search for deptnums with sections even with no keys', t => {
	let query = 'AS/RE 220A'
	let expectedResult = {
		deptnum: ['ASIAN/REL 220'],
	}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('returns an empty object when given nothing but whitespace', t => {
	t.deepEqual(buildQueryFromString(' '), {})
	t.deepEqual(buildQueryFromString('	'), {})
	t.deepEqual(buildQueryFromString('\t'), {})
	t.deepEqual(buildQueryFromString('        '), {})
	t.deepEqual(buildQueryFromString(''), {})
})

test('handles multiple colons in a querystring', t => {
	let query = 'CSCI:helloworld:test:foo'
	let expectedResult = {csci: ['helloworld'], test: ['foo']}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('handles a single key and no value', t => {
	let query = 'ENGL 200:'
	let expectedResult = {deptnum: ['ENGL 200']}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('handles a otherwise-valid string that ends with a colon', t => {
	let query = 'deptnum: ENGL 200:'
	let expectedResult = {deptnum: ['ENGL 200']}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('handles a string that ends with a colon', t => {
	let query = 'deptnum: ENGL 200 valid:'
	let expectedResult = {deptnum: ['ENGL 200 VALID']}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('sorts a five-year token string correctly', t => {
	let query = 'year: $OR year: 2010 year: 2011 year: 2012 year: 2013 year: 2014'
	let expectedResult = {year: ['$OR', 2010, 2011, 2012, 2013, 2014]}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('infers $AND from a list of multiple things', t => {
	let query = 'year: 2010 year: 2011 year: 2012 year: 2013 year: 2014'
	let expectedResult = {year: ['$AND', 2010, 2011, 2012, 2013, 2014]}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})

test('maps multiple multi-word queries to the same words array', t => {
	let query = 'title: Japan description: Otaku'
	let expectedResult = {words: ['$AND', 'japan', 'otaku']}

	t.deepEqual(buildQueryFromString(query, {words: true}), expectedResult)
})

test('makes professors properly title-cased', t => {
	let ktp = 'prof: Katherine Tegtmeyer-pak'
	let olaf = 'prof: olaf a. hall-holt'

	t.deepEqual(
		buildQueryFromString(ktp),
		{instructors: ['Katherine Tegtmeyer-pak']})

	t.deepEqual(
		buildQueryFromString(ktp, {profWords: true}),
		{profWords: ['$AND', 'katherine', 'tegtmeyer', 'pak']})

	t.deepEqual(
		buildQueryFromString(olaf),
		{instructors: ['olaf a. hall-holt']})

	t.deepEqual(
		buildQueryFromString(olaf, {profWords: true}),
		{profWords: ['$AND', 'olaf', 'a', 'hall', 'holt']})
})

test('parses credits correctly', t => {
	let query = 'credits: $OR credits: 1.0 credits: 0.25 credits: .25 credits: 1'
	let expectedResult = {credits: ['$OR', 1.0, 0.25, 0.25, 1.0]}

	t.deepEqual(buildQueryFromString(query), expectedResult)
})
