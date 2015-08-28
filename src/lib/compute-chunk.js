import assertKeys from './assert-keys'
import assign from 'lodash/object/assign'
import collectMatches from './collect-matches'
import collectUsedCourses from './collect-used-courses'
import compact from 'lodash/array/compact'
import countCourses from './count-courses'
import countCredits from './count-credits'
import countDepartments from './count-departments'
import xor from 'lodash/array/xor'
import every from 'lodash/collection/every'
import filterByWhereClause from './filter-by-where-clause'
import find from 'lodash/collection/find'
import findCourse from './find-course'
import forEach from 'lodash/collection/forEach'
import getMatchesFromChildren from './get-matches-from-children'
import getMatchesFromFilter from './get-matches-from-filter'
import getOccurrences from './get-occurrences'
import keys from 'lodash/object/keys'
import map from 'lodash/collection/map'
import simplifyCourse from './simplify-course'
import stringify from 'json-stable-stringify'


/**
 * Computes the result of an expression.
 *
 * It operates by calling a more specific function based on the
 * type of the expression.
 *
 * There are three types of compute functions: those that need the surrounding
 * context, those that don't, and the supervisor function.
 *
 * @param {Object} expr - the expression to process
 * @param {Requirement} ctx - the entire requirement context
 * @param {Course[]} courses - the list of courses to search
 * @param {Course[]} dirty - the list of dirty courses
 * @returns {boolean} - the result of the expression
 */
export default function computeChunk({expr, ctx, courses, dirty}) {
	if (typeof expr !== 'object') {
		throw new TypeError(`computeChunk(): the expr \`${stringify(expr)}\` must be an object, not a ${typeof expr}`)
	}
	assertKeys(expr, '$type')
	const type = expr.$type

	let computedResult = false
	let matches = undefined
	let counted = undefined

	if (type === 'boolean') {
		({computedResult, matches} = computeBoolean({expr, ctx, courses, dirty}))
	}
	else if (type === 'course') {
		({computedResult} = computeCourse({expr, courses, dirty}))
	}
	else if (type === 'modifier') {
		({computedResult, matches, counted} = computeModifier({expr, ctx, courses}))
	}
	else if (type === 'occurrence') {
		({computedResult, matches, counted} = computeOccurrence({expr, courses}))
	}
	else if (type === 'of') {
		({computedResult, matches, counted} = computeOf({expr, ctx, courses, dirty}))
	}
	else if (type === 'reference') {
		({computedResult, matches} = computeReference({expr, ctx}))
	}
	else if (type === 'where') {
		({computedResult, matches, counted} = computeWhere({expr, courses}))
	}
	else {
		throw new TypeError(`computeChunk(): the type "${type}" is not a valid expression type.`)
	}

	expr._result = computedResult

	if (type !== 'course') {
		if (matches !== undefined) {
			expr._matches = matches
		}
		if (counted !== undefined) {
			expr._counted = counted
		}
	}

	// No matter how specific the matched course is, be it just dept/num or
	// all of dept/num/sect/year/sem, it still needs to resolve down to an
	// equivalent of `crsid`. I've done that via `simplifyCourse`, which takes
	// a course and returns a string of "DEPT NUM".

	// Therefore, when we check a course, if it matches, we mark it as
	// `_used`; otherwise, we leave it alone.

	// If we marked it as dirty, then we also run it through simplifyCourse
	// and add that to the `dirty` list, which is a Set.

	// When we finish processing each individual chunk, we will go through
	// it's composite chunks. For any of the composite chunks that evaluated
	// to `false`, we will go through it's composite parts, and remove all of
	// the contained courses from `dirty`.

	if (!computedResult) {
		forEach(map(collectUsedCourses(expr), simplifyCourse), crsid => dirty.delete(crsid))
	}

	return computedResult
}


/**
 * Computes the result of a boolean expression.
 * @param {Object} expr - the expression to process
 * @param {Requirement} ctx - the requirement context
 * @param {Course[]} courses - the list of courses to search
 * @param {Course[]} dirty - the list of dirty courses
 * @returns {boolean} - the result of the modifier
 */
export function computeBoolean({expr, ctx, courses, dirty}) {
	let computedResult = false

	if (expr.hasOwnProperty('$or')) {
		// we only want this to use the first "true" result. we don't need to
		// continue to look after we find one, because this is an or-clause
		const result = find(expr.$or, req => computeChunk({expr: req, ctx, courses, dirty}))
		computedResult = Boolean(result)
	}

	else if (expr.hasOwnProperty('$and')) {
		const results = map(expr.$and, req => computeChunk({expr: req, ctx, courses, dirty}))
		computedResult = every(results)
	}

	else {
		throw new TypeError(`computeBoolean(): neither $or nor $and could be found in ${stringify(expr)}`)
	}

	return {
		computedResult,
		matches: collectMatches(expr),
	}
}


/**
 * Computes the result of a course expression.
 * @param {Object} expr - the expression to build a query from
 * @param {Course[]} courses - the list of courses to search
 * @param {Course[]} dirty - the list of dirty courses
 * @returns {boolean} - if the course was found or not
 */
export function computeCourse({expr, courses, dirty}) {
	assertKeys(expr, '$course')
	const foundCourse = findCourse(expr.$course, courses)

	if (!foundCourse) {
		return {computedResult: false}
	}

	const keysNotFromQuery = xor(keys(expr.$course), keys(foundCourse))
	if (keysNotFromQuery.length) {
		expr.$course._extraKeys = keysNotFromQuery
	}

	const match = assign(expr.$course, foundCourse)
	const crsid = simplifyCourse(match)

	if (dirty.has(crsid)) {
		return {computedResult: false, match}
	}

	dirty.add(crsid)
	expr._used = true
	return {computedResult: true, match}
}


function computeCountWithOperator({comparator, has, needs}) {
	if (comparator !== '$eq' && comparator !== '$lte' && comparator !== '$gte') {
		throw new SyntaxError(`computeModifier(): "${comparator}" must be one of $eq, $lte, or $gte.`)
	}

	// compute the result
	if (comparator === '$lte') {
		return has <= needs
	}
	else if (comparator === '$gte') {
		return has >= needs
	}
	else if (comparator === '$eq') {
		return has === needs
	}

	return false
}


/**
 * Computes the result of a modifier expression.
 * @param {Object} expr - the expression to process
 * @param {Requirement} ctx - the requirement context
 * @param {Course[]} courses - the list of courses to search
 * @returns {boolean} - the result of the modifier
 */
export function computeModifier({expr, ctx, courses}) {
	assertKeys(expr, '$what', '$count', '$from')
	const what = expr.$what

	if (what !== 'course' && what !== 'credit' && what !== 'department') {
		throw new SyntaxError(`computeModifier(): "${what}" is not a valid source for a modifier`)
	}

	let filtered = []
	let numCounted = undefined

	// get matches
	if (expr.$from === 'children') {
		filtered = getMatchesFromChildren(expr, ctx)
	}

	else if (expr.$from === 'filter') {
		filtered = getMatchesFromFilter(ctx)
	}

	else if (expr.$from === 'where') {
		assertKeys(expr, '$where')
		filtered = filterByWhereClause(courses, expr.$where)
	}

	filtered = map(filtered, course =>
		course.hasOwnProperty('$course') ? course.$course : course)

	// count things
	if (what === 'course') {
		numCounted = countCourses(filtered)
	}

	else if (what === 'department') {
		numCounted = countDepartments(filtered)
	}

	else if (what === 'credit') {
		numCounted = countCredits(filtered)
	}

	return {
		computedResult: computeCountWithOperator({comparator: expr.$count.$operator, has: numCounted, needs: expr.$count.$num}),
		counted: numCounted,
		matches: filtered,
	}
}


/**
 * Computes the result of an occurrence expression.
 * @param {Object} expr - the expression to process
 * @param {Course[]} courses - the list of courses to search
 * @returns {boolean} - the result of the occurrence
 */
export function computeOccurrence({expr, courses}) {
	assertKeys(expr, '$course', '$count')

	const filtered = getOccurrences(expr.$course, courses)

	return {
		computedResult: computeCountWithOperator({comparator: expr.$count.$operator, has: filtered.length, needs: expr.$count.$num}),
		counted: filtered.length,
		matches: filtered,
	}
}


/**
 * Computes the result of an of-expression.
 * @param {Object} expr - the expression to process
 * @param {Requirement} ctx - the requirement context
 * @param {Course[]} courses - the list of courses to search
 * @param {Course[]} dirty - the list of dirty courses
 * @returns {boolean} - the result of the of-expression
 */
export function computeOf({expr, ctx, courses, dirty}) {
	assertKeys(expr, '$of', '$count')

	// Go through $of, incrementing count if result of the thing is true.
	// takeWhile runs until it recieves a `false`, so we stop when
	// count >= expr.$count.$num
	//
	// let count = 0
	// takeWhile(expr.$of, req => {
	//     count += Number(computeChunk({expr: req, ctx, courses, dirty}))
	//     return !(computeCountWithOperator({comparator: expr.$count.$operator, has: count, needs: expr.$count.$num})
	// })
	// return {
	//     computedResult: computedResult: computeCountWithOperator({comparator: expr.$count.$operator, has: count, needs: expr.$count.$num}),,
	//     counted: count,
	//     matches: collectMatches(expr),
	// }

	const evaluated = map(expr.$of, req =>
		computeChunk({expr: req, ctx, courses, dirty}))

	const truthy = compact(evaluated)

	return {
		computedResult: computeCountWithOperator({comparator: expr.$count.$operator, has: truthy.length, needs: expr.$count.$num}),
		counted: truthy.length,
		matches: collectMatches(expr),
	}
}


/**
 * Computes the result of a reference expression.
 * @param {Object} expr - the expression to process
 * @param {Requirement} ctx - the requirement context
 * @returns {boolean} - the result of the reference expression
 */
export function computeReference({expr, ctx}) {
	assertKeys(expr, '$requirement')

	if (!(ctx.hasOwnProperty(expr.$requirement))) {
		throw new ReferenceError(`computeReference(): the requirement "${expr.$requirement}" does not exist in the provided requirement context`)
	}

	const target = ctx[expr.$requirement]

	let resultObj = {computedResult: target.computed}

	// this needs to be checked because of the possibility of message-only keys.
	// they don't have a `result` key.
	if (target.hasOwnProperty('result')) {
		resultObj.matches = collectMatches(target.result)
	}

	return resultObj
}


/**
 * Computes the result of a where-expression.
 * @param {Object} expr - the expression to process
 * @param {Course[]} courses - the list of courses to search
 * @returns {boolean} - the result of the where-expression
 */
export function computeWhere({expr, courses}) {
	assertKeys(expr, '$where', '$count')

	const filtered = filterByWhereClause(courses, expr.$where)

	return {
		computedResult: computeCountWithOperator({comparator: expr.$count.$operator, has: filtered.length, needs: expr.$count.$num}),
		matches: filtered,
		counted: filtered.length,
	}
}
