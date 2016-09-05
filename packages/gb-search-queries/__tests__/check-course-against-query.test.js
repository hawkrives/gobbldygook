import test from 'ava'
import checkCourseAgainstQuery from '../check-course-against-query'

test('compares a course to a query object', t => {
	let query = {depts: ['AMCON'], year: [2013]}
	let course = {depts: ['AMCON'], year: 2013}
	t.true(checkCourseAgainstQuery(query)(course))
})

test('properly handles a list of five years', t => {
	let query = {year: ['$OR', 2010, 2011, 2012, 2013, 2014]}
	let course = {depts: ['ASIAN'], year: 2012}
	t.true(checkCourseAgainstQuery(query)(course))
})

test('handles complicated queries', t => {
	let query = {
		depts: ['$AND', 'ASIAN', 'REL'],
		title: ['Japan'],
		level: [200],
		year: [2014],
		semester: ['$OR', 3, 1],
	}
	let course = {
		depts: ['ASIAN', 'REL'],
		year: 2014,
		semester: 1,
		level: 200,
		title: 'Japan',
	}
	t.true(checkCourseAgainstQuery(query)(course))
})

test('handles complicated queries', t => {
	let query = {
		depts: ['$AND', 'ASIAN', 'REL'],
		title: ['Japan'],
		level: [200],
		year: [2014],
		semester: ['$OR', 3, 1],
	}
	let course = {
		depts: ['ASIAN'],
	}
	t.false(checkCourseAgainstQuery(query)(course))
})

test('handles $NOT queries', t => {
	let query = {
		profWords: ['macpherson'],
		deptnum: ['$NOT', 'ASIAN 275'],
	}
	let course = {
		deptnum: 'ASIAN 215',
		profWords: ['kristina', 'macpherson', 'karil', 'kucera'],
	}

	t.true(checkCourseAgainstQuery(query)(course))
})
