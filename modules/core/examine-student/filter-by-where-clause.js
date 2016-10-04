import assertKeys from './assert-keys'
import compareCourseToQualification from './compare-course-to-qualification'
import {filter} from 'lodash'
import {forEach} from 'lodash'
import {isPlainObject} from 'lodash'
import {map} from 'lodash'
import {max} from 'lodash'
import {min} from 'lodash'
import {take} from 'lodash'
import simplifyCourse from './simplify-course'
import {uniqBy} from 'lodash'

export default function filterByWhereClause(baseList, clause, {distinct, fullList, counter}={}) {
	// When filtering by an and-clause, we need access to both the
	// entire list of courses, and the result of the prior iteration.
	// To simplify future invocations, we default to `fullList = list`
	if (!fullList) {
		fullList = baseList
	}

	// There are only two types of where-clauses: boolean, and qualification.
	// Boolean where-clauses are comprised of a set of qualifications.

	// This function always reduces down to a call to filterByQualification
	if (clause.$type === 'qualification') {
		return filterByQualification(baseList, clause, {distinct, fullList, counter})
	}

	// either an and- or or-clause.
	else if (clause.$type === 'boolean') {
		// and-clauses become the result of applying each invocation to the
		// result of the prior one. they are the list of unique courses which
		// meet all of the qualifications.
		if ('$and' in clause) {
			let filtered = baseList
			forEach(clause.$and, q => {
				filtered = filterByWhereClause(filtered, q, {distinct, fullList, counter})
			})
			return filtered
		}

		// or-clauses are the list of unique courses that meet one or more
		// of the qualifications.
		else if ('$or' in clause) {
			let filtrations = []
			forEach(clause.$or, q => {
				filtrations = filtrations.concat(filterByWhereClause(baseList, q, {distinct, counter}))
			})

			// uniquify the list of possibilities by way of turning them into
			// the simplified representations.
			return uniqBy(filtrations, simplifyCourse)
		}

		// only 'and' and 'or' are currently supported.
		else {
			throw new TypeError(`filterByWhereClause: neither $or nor $and were present in ${JSON.stringify(clause)}`)
		}
	}

	// where-clauses *must* be either a 'boolean' or a 'qualification'
	else {
		throw new TypeError(`filterByWhereClause: wth kind of type is a "${clause.$type}" clause?`)
	}
}

const qualificationFunctionLookup = {
	max: max,
	min: min,
}

export function filterByQualification(list, qualification, {distinct=false, fullList, counter={}}={}) {
	assertKeys(qualification, '$key', '$operator', '$value')
	const value = qualification.$value

	if (isPlainObject(value)) {
		if (value.$type === 'boolean') {
			if (!('$or' in value) && !('$and' in value)) {
				throw new TypeError(`filterByQualification: neither $or nor $and were present in ${JSON.stringify(value)}`)
			}
		}
		else if (value.$type === 'function') {
			const func = qualificationFunctionLookup[value.$name]

			if (!func) {
				throw new ReferenceError(`filterByQualification: ${value.$name} is not a valid function name.`)
			}

			const completeList = fullList || list
			// we're not passing distinct or counter back to filterByWhereClause here,
			// because this call is not affected by how the results need to be qualified,
			// since it's finding the matches to get a value from.
			const filtered = filterByWhereClause(completeList, value.$where)
			const items = map(filtered, c => c[value.$prop])
			const computed = func(items)

			// console.log('looked at', completeList)
			// console.log('reduced to', filtered)
			// console.log('came up with', computed)

			value['$computed-value'] = computed
		}
		else {
			throw new TypeError(`filterByQualification: ${value.$type} is not a valid type for a query.`)
		}
	}

	let filtered = filter(list, course =>
		compareCourseToQualification(course, qualification))

	// If we have a limit on the number of courses, then only return the
	// number that we're allowed to accept.
	if (counter && (counter.$operator === '$lte' || counter.$operator === '$eq')) {
		filtered = take(filtered, counter.$num)
	}

	/* if (counter.$operator === '$gte') {
		filtered = filter(list, course =>
			compareCourseToQualification(course, qualification))
	}
	else {
		let count = 0
		forEach(list, course =>  {
			if (compareCourseToQualification(course, qualification)) {
				filtered.push(course)
				count += 1
				if (counter.$operator === '$lte') {
					// We can't use computeCountWithOperator here, because 0
					// <= N for all N. Instead, we check to see if the next
					// step would cause us to go over our limit. If it would,
					// we stop the loop.
					if (count + 1 >= counter.$num) {
						return false // exit now
					}
				}
				else if (counter.$operator === '$eq') {
					// If we have exactly the right number, stop.
					if (count === counter.$num) {
						return false // exit now
					}
				}
			}
		})
	} */

	if (distinct) {
		filtered = uniqBy(filtered, simplifyCourse)
	}

	return filtered
}
