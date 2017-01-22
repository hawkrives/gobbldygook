/* global WorkerGlobalScope */
// @flow
import map from 'lodash/map'
import filter from 'lodash/filter'
import round from 'lodash/round'
import present from 'present'

import { stringifyError } from 'modules/lib'
import { evaluate } from 'modules/core/examine-student'
import { getActiveStudentCourses } from './get-active-student-courses'
import { alterCourse } from './alter-course-for-evaluation'
import debug from 'debug'
const log = debug('worker:check-student-against-area')

function tryEvaluate(student, area) {
	try {
		return evaluate(student, area)
	}
	catch (err) {
		log('checkStudentAgainstArea:', err)
		return { ...area, _error: err.message }
	}
}

function checkStudentAgainstArea(student: any, area: any) {
	return new Promise(resolve => {
		if (!area || area._error || !area._area) {
			log('checkStudentAgainstArea:', (area ? area._error : 'area is null'), area)
			resolve(area)
			return
		}

		student.courses = map(getActiveStudentCourses(student), alterCourse)

		let details = tryEvaluate(student, area._area)
		if (details._error) {
			resolve(details)
			return
		}

		let result = details.result
		let bits = []
		if (result.$type === 'of') {
			bits = result.$of
		}
		else if (result.$type === 'boolean' && result.$booleanType === 'and') {
			bits = result.$and
		}
		else if (result.$type === 'boolean' && result.$booleanType === 'or') {
			bits = result.$or
		}
		let finalReqs = map(bits, b => b._result)

		const maxProgress = finalReqs.length
		const currentProgress = filter(finalReqs, Boolean).length

		resolve({
			...area,
			_area: details,
			_checked: true,
			_progress: {
				at: currentProgress,
				of: maxProgress,
			},
		})
	})
}

export default checkStudentAgainstArea

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
	self.addEventListener('message', ({ data }) => {
		const start = present()

		// why stringify? https://code.google.com/p/chromium/issues/detail?id=536620#c11
		// > We know that serialization/deserialization is slow. It's actually faster to
		// > JSON.stringify() then postMessage() a string than to postMessage() an object. :(

		const [ id, student, area ] = JSON.parse(data)
		log('[check-student] received message:', id, student, area)

		checkStudentAgainstArea(student, area)
			.then(result => {
				self.postMessage(JSON.stringify([ id, 'result', result ]))
				log(`[check-student(${student.name}, ${area.name})] took ${round(present() - start)} ms`)
			})
			.catch(err => {
				self.postMessage(JSON.stringify([ id, 'error', stringifyError(err) ]))
				log(`[check-student(${student.name}, ${area.name}))]`, err)
			})
	})
}
