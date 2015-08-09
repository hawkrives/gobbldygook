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

	const baseAreaResults = {name: area.name, type: area.type, id: area.id}
	if (areaData._error) {
		console.error('checkStudentAgainstArea():', areaData._error)
		return {...baseAreaResults, _error: areaData._error}
	}


	studentData.courses = map(studentData.courses, alterCourse)

	let details = {}
	try {
		details = await evaluate(studentData, areaData)
	}
	catch (err) {
		console.error('checkStudentAgainstArea():', err)
		return {...baseAreaResults, _error: err.message}
	}

	const finalReqs = findLeafRequirements(details)
	const maxProgress = finalReqs.length
	const currentProgress = filter(finalReqs, {computed: true}).length

	return {
		...baseAreaResults,
		...details,
		_progress: {
			at: currentProgress,
			of: maxProgress,
		},
	}
}
