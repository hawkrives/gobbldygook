import test from 'ava'
import queryCourses from '../query-courses'

test('queries a list of courses', t => {
	let query = {
		depts: ['AMCON'],
		year: [2013],
	}
	let courses = [
		{depts: ['AMCON'], year: 2013},
	]
	t.deepEqual(queryCourses(query, courses), courses)
})

test('properly handles a list of five years', t => {
	let query = {
		year: ['$OR', 2010, 2011, 2012, 2013, 2014],
	}
	let courses = [
		{depts: ['AMCON'], year: 2013},
		{depts: ['ASIAN'], year: 2012},
	]
	t.deepEqual(queryCourses(query, courses), courses)
})
