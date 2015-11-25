/* global WorkerGlobalScope */

import zipObject from 'lodash/array/zipObject'
import pairs from 'lodash/object/pairs'
import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import round from 'lodash/math/round'
import present from 'present'

import stringifyError from './stringify-error'
import {evaluate} from '../area-tools'
import findLeafRequirements from '../area-tools/find-leaf-requirements'

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
		const start = present()

		// why stringify? https://code.google.com/p/chromium/issues/detail?id=536620#c11
		// > We know that serialization/deserialization is slow. It's actually faster to
		// > JSON.stringify() then postMessage() a string than to postMessage() an object. :(

		const [id, student, area] = JSON.parse(data)
		// console.log('[check-student] received message:', id, student, area)

		checkStudentAgainstArea(student, area)
			.then(result => {
				console.log(`[check-student(${id})] took ${round(present() - start)} ms`)
				self.postMessage(JSON.stringify([id, 'result', result]))
			})
			.catch(err => {
				console.error(`[check-student(${id})]`, err)
				self.postMessage(JSON.stringify([id, 'error', stringifyError(err)]))
			})
	})
}

