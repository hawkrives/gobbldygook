import {findWordForProgress} from 'sto-helpers'
import evaluate from '../lib/evaluate'
import findLeafRequirements from '../lib/find-leaf-requirements'

import zipObject from 'lodash/array/zipObject'
import pairs from 'lodash/object/pairs'
import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'

function alterCourse(course) {
	return zipObject(map(pairs(course), ([key, value]) => {
		if (key === 'depts') {
			key = 'department'
		}
		else if (key === 'num') {
			key = 'number'
		}
		return [key, value]
	}))
}


/**
 * Checks a student object against an area of study.
 *
 * @param {Object} student - the student to check
 * @param {Object} area - the area to check against
 * @returns {Promise} - the promise for a result
 * @promise ResultsPromise
 * @fulfill {Object} - The details of the area check.
 */
export default async function checkStudentAgainstArea(student, area) {
	const studentData = await student.data()
	const areaData = await area.data
	const areaId = area.id

	studentData.courses = map(studentData.courses, alterCourse)

	const details = await Promise.resolve(evaluate(studentData, areaData))

	const finalReqs = findLeafRequirements(details)
    const maxProgress = finalReqs.length
    const currentProgress = filter(finalReqs, {computed: true}).length
    const progressWord = findWordForProgress(maxProgress, currentProgress)

	return {
		...details,
		id: areaId,
		_progress: {
			at: currentProgress,
			of: maxProgress,
			word: progressWord,
		},
	}
}
