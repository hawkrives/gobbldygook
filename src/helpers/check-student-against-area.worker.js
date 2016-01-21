/* global WorkerGlobalScope */

import mapKeys from 'lodash/mapKeys'
import map from 'lodash/map'
import filter from 'lodash/filter'
import round from 'lodash/round'
import present from 'present'

import stringifyError from './stringify-error'
import evaluate from '../area-tools/evaluate'
import findLeafRequirements from '../area-tools/find-leaf-requirements'
import getActiveStudentCourses from './get-active-student-courses'

function alterCourse(course) {
	return mapKeys(course, (value, key) => {
		if (key === 'depts') {
			key = 'department'
		}
		else if (key === 'num') {
			key = 'number'
		}
		return key
	})
}

function checkStudentAgainstArea(student, area) {
	const areaData = area._area

	if (area._error) {
		console.error('checkStudentAgainstArea:', area._error, area)
		return Promise.resolve(area)
	}

	student.courses = map(getActiveStudentCourses(student), alterCourse)

	let details = {}
	try {
		details = evaluate(student, areaData)
	}
	catch (err) {
		console.error('checkStudentAgainstArea:', err)
		return Promise.resolve({...area, _error: err.message})
	}

	const finalReqs = findLeafRequirements(details)
	const maxProgress = finalReqs.length
	const currentProgress = filter(finalReqs, {computed: true}).length

	return Promise.resolve({
		...area,
		_area: details,
		_checked: true,
		_progress: {
			at: currentProgress,
			of: maxProgress,
		},
	})
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
				self.postMessage(JSON.stringify([id, 'result', result]))
				console.log(`[check-student(${id})] took ${round(present() - start)} ms`)
			})
			.catch(err => {
				self.postMessage(JSON.stringify([id, 'error', stringifyError(err)]))
				console.error(`[check-student(${id})]`, err)
			})
	})
}

