// @flow
import applyFilter from './apply-filter'
import applyFulfillmentToExpression from './apply-fulfillment-to-expression'
import computeChunk from './compute-chunk'
import getFulfillment from './get-fulfillment'
import getOverride from './get-override'
import hasOverride from './has-override'
import isRequirementName from './is-requirement-name'
import {mapValues} from 'lodash'
import type {Requirement, Course, OverridesObject, FulfillmentsObject, crsidT} from './types'


// The overall computation is done by compute, which is in charge of computing
// sub-requirements and such.
type ComputeArguments = {
	path: string[],
	courses: Course[],
	overrides: OverridesObject,
	fulfillments: FulfillmentsObject,
	dirty?: Set<crsidT>,
}

export default function compute(requirement: Requirement, {path, courses=[], overrides={}, fulfillments={}, dirty=new Set()}: ComputeArguments) {
	let childrenShareCourses = Boolean(requirement['children share courses'])

	requirement = mapValues(requirement, (req, name) => {
		if (isRequirementName(name)) {
			// Primarily for the math major: if a requirement is set to 'children share courses',
			// then they share courses. The default is false (well, undefined).
			// If they don't share courses, then they share the dirty set;
			// if they do, however, they each receive their own dirty set, so that they don't know if a course has been used yet or not.
			// 'children share courses' is non-recursive.
			let localDirty = dirty
			if (childrenShareCourses) {
				localDirty = new Set()
			}
			return compute(req, {path: path.concat([name]), courses, overrides, dirty: localDirty, fulfillments})
		}
		return req
	})

	let computed = false

	// Apply a filter to the set of courses
	if ('filter' in requirement) {
		courses = applyFilter(requirement.filter, courses)
	}

	// Now check for results
	if ('result' in requirement) {
		if (requirement.result === '') {
			throw new SyntaxError(`compute(): requirement.result must not be empty (in ${JSON.stringify(requirement)})`)
		}

		let fulfillment = getFulfillment(path, fulfillments)
		if (fulfillment) {
			requirement.result = applyFulfillmentToExpression(requirement.result, fulfillment)
		}

		computed = computeChunk({expr: requirement.result, ctx: requirement, courses, dirty, fulfillment})
	}

	// or ask for an override
	else if ('message' in requirement) {
		computed = false
	}

	// or throw an error
	else {
		throw new TypeError('compute(): either `message` or `result` is required')
	}

	requirement.computed = computed

	if (hasOverride(path, overrides)) {
		requirement.overridden = true
		requirement.computed = getOverride(path, overrides)
	}

	return requirement
}
