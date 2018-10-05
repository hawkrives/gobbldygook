// @flow

import {evaluate, type EvaluationResult} from '@gob/examine-student'
import {type ParsedHansonFile} from '@gob/hanson-format'
import {alterForEvaluation as alterCourse} from '@gob/courses'
import type {Course as CourseType} from '@gob/types'

function tryEvaluate({
	courses,
	area,
	fulfillments,
	overrides,
}): EvaluationResult {
	try {
		return evaluate({courses, area, fulfillments, overrides})
	} catch (err) {
		console.warn(err)
		return {
			$type: 'requirement',
			computed: false,
			error: err.message,
			progress: {at: 0, of: 1},
		}
	}
}

export function checkAgainstArea(
	area: ParsedHansonFile,
	args: {
		courses: Array<CourseType>,
		// TODO: make this not be `any`
		fulfillments: {[key: string]: any},
		// TODO: make this not be `any`
		overrides: {[key: string]: any},
	},
): EvaluationResult {
	let {courses, fulfillments, overrides} = args
	courses = courses.map(alterCourse)

	return tryEvaluate({courses, area, fulfillments, overrides})
}
