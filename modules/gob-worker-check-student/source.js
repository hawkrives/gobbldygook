// @flow

import filter from 'lodash/filter'
import debug from 'debug'

import {evaluate} from '@gob/examine-student'
import {getActiveCourses} from '@gob/object-student'
import {alterForEvaluation as alterCourse} from '@gob/courses'
import type {AreaOfStudyType, HydratedAreaOfStudyType, AreaOfStudyEvaluationError, HydratedStudentType} from '@gob/object-student'
const log = debug('worker:check-student:worker')

function tryEvaluate(student, area): any {
	try {
		return evaluate((student: any), area)
	} catch (err) {
		log('checkStudentAgainstArea:', err)
		return {...area, _error: err.message}
	}
}

function doWork(student: HydratedStudentType, area: AreaOfStudyType): HydratedAreaOfStudyType | AreaOfStudyEvaluationError {
	(student: any).courses = getActiveCourses(student).map(alterCourse)

	let details = tryEvaluate(student, (area: any)._area)
	if (details._error) {
		return details
	}

	let result = details.result
	let bits = []
	switch (result.$type) {
		case 'of':
			bits = result.$of
			break
		case 'boolean': {
			if (result.$booleanType === 'and') {
				bits = result.$and
			} else if (result.$booleanType === 'or') {
				bits = result.$or
			}
			break
		}
		default:
			break
	}

	const finalReqs = bits.map(b => ('_result' in b ? (b: any)._result : false))

	const maxProgress = finalReqs.length
	const currentProgress = filter(finalReqs, Boolean).length

	return {
		...area,
		_error: false,
		_area: details,
		_checked: true,
		_progress: {
			at: currentProgress,
			of: maxProgress,
		},
	}
}

export default async function checkStudentAgainstArea(
	student: any,
	area: any,
): any {
	if (!area || area._error || !area._area) {
		log(
			'checkStudentAgainstArea:',
			area ? area._error : 'area is null',
			area,
		)
		return area
	}

	return doWork(student, area)
}
