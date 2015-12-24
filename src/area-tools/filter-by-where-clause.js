import assertKeys from './assert-keys'
import compareCourseToQualification from './compare-course-to-qualification'
import filter from 'lodash/collection/filter'
import forEach from 'lodash/collection/forEach'
import has from 'lodash/object/has'
import isPlainObject from 'lodash/lang/isPlainObject'
import max from 'lodash/collection/max'
import min from 'lodash/collection/min'
import pluck from 'lodash/collection/pluck'
import simplifyCourse from './simplify-course'
import uniq from 'lodash/array/uniq'

export default function filterByWhereClause(baseList, clause, distinct, fullList) {
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
		return filterByQualification(baseList, clause, distinct, fullList)
	}

	// either an and- or or-clause.
	else if (clause.$type === 'boolean') {
		// and-clauses become the result of applying each invocation to the
		// result of the prior one. they are the list of unique courses which
		// meet all of the qualifications.
		if (has(clause, '$and')) {
			let filtered = baseList
			forEach(clause.$and, q => {
				filtered = filterByWhereClause(filtered, q, distinct, fullList)
			})
			return filtered
		}

		// or-clauses are the list of unique courses that meet one or more
		// of the qualifications.
		else if (has(clause, '$or')) {
			let filtrations = []
			forEach(clause.$or, q => {
				filtrations = filtrations.concat(filterByWhereClause(baseList, q, distinct))
			})

			// uniquify the list of possibilities by way of turning them into
			// the simplified representations.
			return uniq(filtrations, simplifyCourse)
		}

		// only 'and' and 'or' are currently supported.
		else {
			throw new TypeError(`filterByWhereClause(): neither $or nor $and could be found in ${JSON.stringify(clause)}`)
		}
	}

	// where-clauses *must* be either a 'boolean' or a 'qualification'
	else {
		throw new TypeError(`filterByWhereClause(): wth kind of type is a "${clause.$type}" clause?`)
	}
}

const qualificationFunctionLookup = {
	max: max,
	min: min,
}

export function filterByQualification(list, qualification, distinct, fullList) {
	assertKeys(qualification, '$key', '$operator', '$value')
	const value = qualification.$value

	if (isPlainObject(value)) {
		if (value.$type === 'boolean') {
			if (!value.hasOwnProperty('$or') && !value.hasOwnProperty('$and')) {
				throw new TypeError(`compareCourseToQualification(): neither $or nor $and could be found in ${JSON.stringify(value)}`)
			}
		}
		else if (value.$type === 'function') {
			const func = qualificationFunctionLookup[value.$name]

			if (!func) {
				throw new ReferenceError(`filterByQualification(): ${value.$name} is not a valid function name.`)
			}

			const completeList = fullList || list
			const filtered = filterByWhereClause(completeList, value.$where, distinct)
			const items = pluck(filtered, value.$prop)
			const computed = func(items)

			// console.log('looked at', completeList)
			// console.log('reduced to', filtered)
			// console.log('came up with', computed)

			value['$computed-value'] = computed
		}
		else {
			throw new TypeError(`filterByQualification(): ${value.$type} is not a valid type for a query.`)
		}
	}

	let filtered = filter(list, course =>
		compareCourseToQualification(course, qualification))

	if (distinct) {
		filtered = uniq(filtered, simplifyCourse)
	}

	return filtered
}
