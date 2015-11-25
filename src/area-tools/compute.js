import mapValues from 'lodash/object/mapValues'
import isRequirementName from './is-requirement-name'
import applyFilter from './apply-filter'
import computeChunk from './compute-chunk'
import hasOverride from './has-override'
import getOverride from './get-override'

// The overall computation is done by compute, which is in charge of computing
// sub-requirements and such.

export default function compute(requirement, {path, courses=[], overrides={}, dirty=new Set()}) {
	requirement = mapValues(requirement, (req, name) => {
		if (isRequirementName(name)) {
			return compute(req, {path: path.concat([name]), courses, overrides, dirty})
		}
		return req
	})

	let computed = false

	// Apply a filter to the set of courses
	if (requirement.hasOwnProperty('filter')) {
		courses = applyFilter(requirement.filter, courses)
	}

	// Now check for results
	if (requirement.hasOwnProperty('result')) {
		if (requirement.result === '') {
			throw new SyntaxError(`compute(): requirement.result must not be empty (in ${JSON.stringify(requirement)})`)
		}
		computed = computeChunk({expr: requirement.result, ctx: requirement, courses, dirty})
	}

	// or ask for an override
	else if (requirement.hasOwnProperty('message')) {
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
