import applyFilter from '../examine-student/apply-filter'
import excludeCourse from '../examine-student/exclude-course'
import filterByWhereClause from '../examine-student/filter-by-where-clause'
import findCourse from '../examine-student/find-course'
import getMatchesFromChildren from '../examine-student/get-matches-from-children'
import getMatchesFromFilter from '../examine-student/get-matches-from-filter'
import getOccurrences from '../examine-student/get-occurrences'
import isRequirementName from '../examine-student/is-requirement-name'
// import simplifyCourse from '../examine-student/simplify-course'
import flatMap from 'lodash/flatMap'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import padStart from 'lodash/padStart'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'

function simplifyCourse(course) {
	if (course.section) {
		return `${sortBy(course.department).join('/')} ${course.number}${course.section} ${course.type}`
	}
	return `${sortBy(course.department).join('/')} ${course.number} ${course.type}`
}

let indent = 0

export function cli({ courses, area }) {
	// console.log(area)
	// console.log(courses.length)
	// console.log(courses.find(c => c.department[0] === 'CSCI' && c.number === 251))
	const { name, type } = area
	console.log(evaluate(area, { path: [ type, name ], courses }).map(simplifyCourse))
}


function evaluate(requirement, { path, courses=[], allMatched=[] }) {
	indent++
	console.log(padStart('', indent), 'evalute start:', path.join(' > '))
	requirement = mapValues(requirement, (req, name) => {
		if (isRequirementName(name)) {
			let matched = evaluate(req, { path: path.concat([ name ]), courses, allMatched })
			allMatched = uniqBy(allMatched.concat(matched), x => x.clbid)
			return req
		}
		return req
	})

	// Apply a filter to the set of courses
	if ('filter' in requirement) {
		courses = applyFilter(requirement.filter, courses)
	}

	// Now check for results
	if ('result' in requirement) {
		allMatched = uniqBy(allMatched.concat(evaluateChunk({ expr: requirement.result, ctx: requirement, courses, allMatched })), x => x.clbid)
	}

	console.log(padStart('', indent), 'evalute end:', path.join(' > '), allMatched.length)
	indent--
	return allMatched
}


function evaluateChunk({ expr, ctx, courses, allMatched }) {
	indent++
	console.log(padStart('', indent), 'evaluateChunk', '$' + expr.$type)

	// Modifiers, occurrences, references, and wheres don't need isNeeded,
	// because they don't result in recursive calls to evaluateChunk.
	let res = []
	if (expr.$type === 'boolean') {
		res = allMatched.concat(evaluateBoolean({ expr, ctx, courses, allMatched }))
	}
	else if (expr.$type === 'course') {
		res = allMatched.concat(evaluateCourse({ expr, courses, allMatched }))
	}
	else if (expr.$type === 'modifier') {
		res = allMatched.concat(evaluateModifier({ expr, ctx, courses, allMatched }))
	}
	else if (expr.$type === 'occurrence') {
		res = allMatched.concat(evaluateOccurrence({ expr, courses, allMatched }))
	}
	else if (expr.$type === 'of') {
		res = allMatched.concat(evaluateOf({ expr, ctx, courses, allMatched }))
	}
	else if (expr.$type === 'reference') {
		res = allMatched
	}
	else if (expr.$type === 'where') {
		res = allMatched.concat(evaluateWhere({ expr, courses, allMatched }))
	}
	console.log(padStart('', indent), 'evaluateChunk done', res.length)

	indent--
	return res
}


function evaluateBoolean({ expr, ctx, courses, allMatched }) {
	indent++
	console.log(padStart('', indent), 'evaluateBoolean')
	let res = []
	if ('$or' in expr) {
		res = flatMap(expr.$or, req => evaluateChunk({ expr: req, ctx, courses, allMatched }))
	}
	else if ('$and' in expr) {
		res = flatMap(expr.$and, req => evaluateChunk({ expr: req, ctx, courses, allMatched }))
	}
	console.log(padStart('', indent), 'evaluateBoolean done', res.length)

	indent--
	return res
}


function evaluateCourse({ expr, courses }) {
	indent++
	console.log(padStart('', indent), 'evaluateCourse start')
	const foundCourse = findCourse(expr.$course, courses)

	if (!foundCourse) {
		console.log(padStart('', indent), 'evaluateCourse done: fail')
		indent--
		return []
	}

	console.log(padStart('', indent), 'evaluateCourse done: success')

	indent--
	return [ foundCourse ]
}


function evaluateModifier({ expr, ctx, courses }) {
	indent++
	console.log(padStart('', indent), 'evaluateModifier')
	let filtered = []

	// get matches
	if (expr.$from === 'children') {
		filtered = getMatchesFromChildren(expr, ctx)
	}

	else if (expr.$from === 'filter') {
		filtered = getMatchesFromFilter(ctx)
	}

	else if (expr.$from === 'filter-where') {
		filtered = getMatchesFromFilter(ctx)
		filtered = filterByWhereClause(filtered, expr.$where)
	}

	else if (expr.$from === 'where') {
		filtered = filterByWhereClause(courses, expr.$where)
	}

	else if (expr.$from === 'children-where') {
		filtered = getMatchesFromChildren(expr, ctx)
		filtered = filterByWhereClause(filtered, expr.$where)
	}

	// eslint-disable-next-line no-confusing-arrow
	filtered = map(filtered, course => '$course' in course ? course.$course : course)

	if (expr.$besides) {
		filtered = excludeCourse(expr.$besides, filtered)
	}

	indent--
	return filtered
}


function evaluateOccurrence({ expr, courses }) {
	indent++
	console.log(padStart('', indent), 'evaluateOccurrence start')
	let result = getOccurrences(expr.$course, courses)
	console.log(padStart('', indent), 'evaluateOccurrence done', result.length)
	indent--
	return result
}


function evaluateOf({ expr, ctx, courses, allMatched }) {
	indent++
	console.log(padStart('', indent), 'evaluateOf start')
	let result = flatMap(expr.$of, req => evaluateChunk({ expr: req, ctx, courses, allMatched }))
	console.log(padStart('', indent), 'evaluateOf done', result.length)
	indent--
	return result
}


function evaluateWhere({ expr, courses }) {
	indent++
	console.log(padStart('', indent), 'evaluateWhere start')
	let result = filterByWhereClause(courses, expr.$where, { distinct: expr.$distinct, counter: expr.$count })
	console.log(padStart('', indent), 'evaluateWhere done', result.length)
	indent--
	return result
}
