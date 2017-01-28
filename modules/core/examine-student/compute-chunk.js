import every from 'lodash/every'
import forEach from 'lodash/forEach'
import keys from 'lodash/keys'
import map from 'lodash/map'
import some from 'lodash/some'
import take from 'lodash/take'
import xor from 'lodash/xor'
import stringify from 'stabilize'
import applyFulfillmentToResult from './apply-fulfillment-to-result'
import assertKeys from './assert-keys'
import collectMatches from './collect-matches'
import collectTakenCourses from './collect-taken-courses'
import computeCountWithOperator from './compute-count-with-operator'
import countCourses from './count-courses'
import {countCredits} from './count-credits'
import countDepartments from './count-departments'
import excludeCourse from './exclude-course'
import filterByWhereClause from './filter-by-where-clause'
import findCourse from './find-course'
import getMatchesFromChildren from './get-matches-from-children'
import getMatchesFromFilter from './get-matches-from-filter'
import getOccurrences from './get-occurrences'
import simplifyCourse from './simplify-course'


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
export default function computeChunk({expr, ctx, courses, dirty, fulfillment, isNeeded=true}) {
	if (typeof expr !== 'object') {
		throw new TypeError(`computeChunk(): the expr \`${stringify(expr)}\` must be an object, not a ${typeof expr}`)
	}
	assertKeys(expr, '$type')
	const type = expr.$type

	let computedResult = false
	let matches = undefined
	let counted = undefined

	// Modifiers, occurrences, references, and wheres don't need isNeeded,
	// because they don't result in recursive calls to computeChunk.
	if (type === 'boolean') {
		({computedResult, matches} = computeBoolean({expr, ctx, courses, dirty, isNeeded}))
	}
	else if (type === 'course') {
		({computedResult} = computeCourse({expr, courses, dirty, isNeeded}))
	}
	else if (type === 'modifier') {
		({computedResult, matches, counted} = computeModifier({expr, ctx, courses}))
	}
	else if (type === 'occurrence') {
		({computedResult, matches, counted} = computeOccurrence({expr, courses}))
	}
	else if (type === 'of') {
		({computedResult, matches, counted} = computeOf({expr, ctx, courses, dirty, isNeeded}))
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

	if (fulfillment) {
		({computedResult, matches, counted} = applyFulfillmentToResult({fulfillment, expr, computedResult, matches, counted}))
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
	// a course and returns a string of "DEPT NUM TYPE".

	// Therefore, when we check a course, if it matches, we mark it as
	// `_taken`; otherwise, we leave it alone.

	// If we marked it as dirty, then we also run it through simplifyCourse
	// and add that to the `dirty` list, which is a Set.

	// When we finish processing each individual chunk, we will go through
	// it's composite chunks. For any of the composite chunks that evaluated
	// to `false`, we will go through it's composite parts, and remove all of
	// the contained courses from `dirty`.

	if (!computedResult) {
		let identifiers = map(collectTakenCourses(expr), simplifyCourse)
		forEach(identifiers, crsid => dirty.delete(crsid))
	}

	expr._checked = true

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
export function computeBoolean({expr, ctx, courses, dirty, isNeeded}) {
	let computedResult = false

	if ('$or' in expr) {
		// we only want this to use the first "true" result. we don't need to
		// continue to look after we find one, because this is an or-clause

		// `haveAnyBeenTrue` tells us if we need to mark any further courses as dirty.
		// If it's true, then we don't actually need any more courses; we're just looking.
		let haveAnyBeenTrue = false
		const results = map(expr.$or, req => {
			// we check the next chunk of the requirement:

			// isNeeded is set to the negated `haveAnyBeenTrue`, because
			// that's how we check if we need to flag any further courses.
			let thisResult = computeChunk({expr: req, ctx, courses, dirty, isNeeded: !haveAnyBeenTrue})

			// now, if we just found one, we set haveAnyBeenTrue; otherwise,
			// we leave it at its prior value.
			haveAnyBeenTrue = thisResult || haveAnyBeenTrue

			// and we're collecting an array of the results, so we'll return
			// the result.
			return thisResult
		})
		computedResult = some(results)
	}

	else if ('$and' in expr) {
		const results = map(expr.$and, req => computeChunk({expr: req, ctx, courses, dirty, isNeeded}))
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
export function computeCourse({expr, courses, dirty, isNeeded}) {
	assertKeys(expr, '$course')
	const foundCourse = findCourse(expr.$course, courses)

	if (!foundCourse) {
		return {computedResult: false}
	}

	const keysNotFromQuery = xor(keys(expr.$course), keys(foundCourse))
	if (keysNotFromQuery.length) {
		expr.$course._extraKeys = keysNotFromQuery
	}

	expr._request = expr.$course
	expr.$course = {...expr.$course, ...foundCourse}
	let match = expr.$course
	const crsid = simplifyCourse(match)

	if (dirty.has(crsid)) {
		return {computedResult: false, match}
	}

	expr._taken = true
	if (isNeeded) {
		dirty.add(crsid)
		return {computedResult: true, match}
	}
	else {
		return {computedResult: false, match}
	}
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
		throw new TypeError(`computeModifier(): "${what}" is not a valid source for a modifier`)
	}

	let filtered = []
	let numCounted = undefined

	// get matches
	if (expr.$from === 'children') {
		assertKeys(expr, '$children')
		filtered = getMatchesFromChildren(expr, ctx)
	}

	else if (expr.$from === 'filter') {
		assertKeys(ctx, 'filter')
		filtered = getMatchesFromFilter(ctx)
	}

	else if (expr.$from === 'filter-where') {
		assertKeys(expr, '$where')
		filtered = getMatchesFromFilter(ctx)
		filtered = filterByWhereClause(filtered, expr.$where)
	}

	else if (expr.$from === 'where') {
		assertKeys(expr, '$where')
		filtered = filterByWhereClause(courses, expr.$where)
	}

	else if (expr.$from === 'children-where') {
		assertKeys(expr, '$where', '$children')
		filtered = getMatchesFromChildren(expr, ctx)
		filtered = filterByWhereClause(filtered, expr.$where)
	}

	else {
		throw new TypeError(`computeModifier: "${expr.$from}" is not a valid $from value`)
	}


	// normally, you're allowed to count courses, or departments, or credits,
	// but if you as for an 'at most' or an 'exactly', it will now throw a
	// parse error, so we don't have to worry about how to count 'at most two
	// departments'.
	// thus, if we have a limit on the number of courses, then only return the
	// number that we're allowed to accept.
	if (expr.$count.$operator === '$lte' || expr.$count.$operator === '$eq') {
		filtered = take(filtered, expr.$count.$num)
	}

	// eslint-disable-next-line no-confusing-arrow
	filtered = map(filtered, course =>
		'$course' in course ? course.$course : course)


	if (expr.$besides) {
		filtered = excludeCourse(expr.$besides, filtered)
	}

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

	else {
		throw new TypeError(`computeModifier: "${what}" is not a valid thing to count`)
	}


	return {
		computedResult: computeCountWithOperator({
			comparator: expr.$count.$operator,
			has: numCounted,
			needs: expr.$count.$num,
		}),
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

	let filtered = getOccurrences(expr.$course, courses)
	// If we have a limit on the number of courses, then only return the
	// number that we're allowed to accept.
	if (expr.$count.$operator === '$lte' || expr.$count.$operator === '$eq') {
		filtered = take(filtered, expr.$count.$num)
	}

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
export function computeOf({expr, ctx, courses, dirty, isNeeded}) {
	assertKeys(expr, '$of', '$count')

	// Go through $of, incrementing count if result of the thing is true.
	let count = 0
	forEach(expr.$of, req => {
		// computeChunk return a boolean.
		// Number() converts that to a 0 or a 1, which then is added to `count`.
		let thisResult = computeChunk({expr: req, ctx, courses, dirty, isNeeded})
		if (isNeeded) {
			count += Number(thisResult)
		}

		// We compute didPass out here so that it's in a more standard place
		let didPass = computeCountWithOperator({
			comparator: expr.$count.$operator,
			needs: expr.$count.$num,
			has: count,
		})

		// Now we break into separate paths.

		// Note that none of these exit the loop early, because we have to
		// look at every chunk. Instead, we note that we don't need to mark
		// any other courses as being dirty once we've passed the check.
		if (expr.$count.$operator === '$gte') {
			// If we've amassed enough matches, stop checking.
			if (didPass) {
				isNeeded = false
			}
		}
		else if (expr.$count.$operator === '$eq') {
			// If we have exactly the right number, stop.
			if (didPass) {
				isNeeded = false
			}
		}
		else if (expr.$count.$operator === '$lte') {
			// We can't use computeCountWithOperator here, because 0 <= N for all N.
			// Instead, we check to see if the next step would cause us to go over our limit.
			// If it would, we stop the loop.
			if (count + 1 >= expr.$count.$num) {
				isNeeded = false
			}
		}
		else {
			throw new TypeError(`computeOf: not sure what to do with a "${expr.$count.$operator}" operator`)
		}
	})

	return {
		computedResult: computeCountWithOperator({
			comparator: expr.$count.$operator,
			needs: expr.$count.$num,
			has: count,
		}),
		counted: count,
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

	if (!(expr.$requirement in ctx)) {
		throw new ReferenceError(`computeReference(): the requirement "${expr.$requirement}" does not exist in the provided requirement context`)
	}

	const target = ctx[expr.$requirement]

	let resultObj = {computedResult: target.computed}

	// this needs to be checked because of the possibility of message-only keys.
	// they don't have a `result` key.
	if ('result' in target) {
		resultObj.matches = collectMatches(target.result)
	}

	expr._checked = target._checked

	return resultObj
}


/**
 * Computes the result of a where-expression.
 * @param {Object} expr - the expression to process
 * @param {Course[]} courses - the list of courses to search
 * @returns {boolean} - the result of the where-expression
 */
export function computeWhere({expr, courses}) {
	assertKeys(expr, '$where', '$count', '$distinct')

	const filtered = filterByWhereClause(courses, expr.$where, {distinct: expr.$distinct, counter: expr.$count})

	return {
		computedResult: computeCountWithOperator({
			comparator: expr.$count.$operator,
			has: filtered.length,
			needs: expr.$count.$num,
		}),
		matches: filtered,
		counted: filtered.length,
	}
}
