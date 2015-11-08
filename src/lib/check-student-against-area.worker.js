/* global WorkerGlobalScope */

import zipObject from 'lodash/array/zipObject'
import pairs from 'lodash/object/pairs'
import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'

import stringifyError from './stringify-error'
import evaluate from '../lib/evaluate'
import findLeafRequirements from '../lib/find-leaf-requirements'

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

async function checkStudentAgainstArea(studentData, area) {
	const areaData = area.data

	const baseAreaInfo = {name: area.name, type: area.type, id: area.id}
	if (areaData._error) {
		console.error('checkStudentAgainstArea():', areaData._error, baseAreaInfo)
		return {...baseAreaInfo, _error: areaData._error}
	}

	studentData.courses = map(studentData.courses, alterCourse)

	let details = {}
	try {
		details = await evaluate(studentData, areaData)
	}
	catch (err) {
		console.error('checkStudentAgainstArea():', err)
		return {...baseAreaInfo, _error: err.message}
	}

	const finalReqs = findLeafRequirements(details)
	const maxProgress = finalReqs.length
	const currentProgress = filter(finalReqs, {computed: true}).length

	return {
		...baseAreaInfo,
		...details,
		_checked: true,
		_progress: {
			at: currentProgress,
			of: maxProgress,
		},
	}
}

export default checkStudentAgainstArea

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
	self.addEventListener('message', ({data}) => {
		const [id, student, area] = data
		// console.log('[check-student] received message:', id, student, area)

		checkStudentAgainstArea(student, area)
			.then(result => self.postMessage([id, 'result', result]))
			.catch(err => {
				console.error(`[check-student(${id})]`, err)
				self.postMessage([id, 'error', JSON.parse(stringifyError(err))])
			})
	})
}

