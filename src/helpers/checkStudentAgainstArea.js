import {findWordForProgress} from 'sto-helpers'
import evaluate from '../lib/evaluate'

import zipObject from 'lodash/array/zipObject'
import pairs from 'lodash/object/pairs'
import map from 'lodash/collection/map'

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
 * @param {Object} student
 * @param {Object} area
 * @promise ResultsPromise
 * @fulfill {Object} - The details of the area check.
 */
async function checkStudentAgainstArea(student, area) {
	const studentData = await student.data()
	const areaData = await area.data
	const areaId = area.id

	studentData.courses = map(studentData.courses, alterCourse)

	const details = await Promise.resolve(evaluate(studentData, areaData))

	// let currentProgress = _(listOfResults).reject(isUndefined).filter(isTrue).size()
	// let maxProgress = listOfResults.length
	const currentProgress = 5
	const maxProgress = 10

	return {
		...details,
		id: areaId,
		_progress: {
			at: currentProgress,
			of: maxProgress,
			word: findWordForProgress(maxProgress, currentProgress),
		},
	}
}

export default checkStudentAgainstArea
