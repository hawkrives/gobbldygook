// @flow
import assertKeys from './assert-keys'
import compute from './compute'

import type {
	Course,
	ParsedHansonFile,
	OverridesObject,
	FulfillmentsObject,
	EvaluationResult,
} from './types'

type Input = {
	area: ParsedHansonFile,
	courses: Array<Course>,
	overrides: OverridesObject,
	fulfillments: FulfillmentsObject,
}

export function evaluate({
	courses = [],
	overrides = {},
	fulfillments = {},
	area,
}: Input): EvaluationResult {
	assertKeys(area, 'name', 'result', 'type', 'revision')
	let {name, type} = area

	let result = compute(area, {
		path: [type, name],
		courses,
		overrides,
		fulfillments,
	})

	if (!result.details) {
		return {
			error: '`details` missing in result!',
			computed: false,
			details: null,
			progress: {at: 0, of: 1},
		}
	}

	let resultDetails = result.details.result
	let bits = []
	switch (resultDetails.$type) {
		case 'of':
			bits = resultDetails.$of
			break
		case 'boolean': {
			if (resultDetails.$booleanType === 'and') {
				bits = resultDetails.$and
			} else if (resultDetails.$booleanType === 'or') {
				bits = resultDetails.$or
			}
			break
		}
		default:
			break
	}

	const finalReqs = bits.map(b => ('_result' in b ? (b: any)._result : false))

	const maxProgress = finalReqs.length
	const currentProgress = finalReqs.filter(Boolean).length

	return {
		...result,
		progress: {
			at: currentProgress,
			of: maxProgress,
		},
	}
}
