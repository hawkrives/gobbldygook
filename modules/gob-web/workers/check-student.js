// @flow

import uniqueId from 'lodash/uniqueId'
import CheckStudentWorker from './check-student.worker'
import {type ParsedHansonFile} from '@gob/hanson-format'
import {type EvaluationResult} from '@gob/examine-student'
import {Student} from '@gob/object-student'
import {getCourse} from '../helpers/get-courses'
import mem from 'mem'
import QuickLRU from 'quick-lru'

const worker = new CheckStudentWorker()

worker.addEventListener('error', function(event: Event) {
	console.warn('received error from check-student worker:', event)
})

// Checks a student object against an area of study.
async function checkStudentAgainstArea(
	student: Student,
	area: ParsedHansonFile,
): Promise<EvaluationResult> {
	return new Promise(resolve => {
		const sourceId = uniqueId()
		function onMessage({data: messageData}) {
			const {id: resultId, type, data} = JSON.parse(messageData)
			if (resultId === sourceId) {
				worker.removeEventListener('message', onMessage)
				if (type === 'result') {
					resolve(data)
				} else if (type === 'error') {
					resolve({ $type: 'requirement', computed: false, error: data.message, progress: {at: 0, of: 1} })
				}
			}
		}
		worker.addEventListener('message', onMessage)
		student.activeCourses(getCourse).then(courses => {
			let {fulfillments, overrides, name} = student
			let msg = JSON.stringify({ id: sourceId, area, courses, fulfillments, overrides, name })
			worker.postMessage(msg)
		})
	})
}

const memoized: typeof checkStudentAgainstArea = mem(checkStudentAgainstArea, {
	cache: new QuickLRU({maxSize: 8}),
	cacheKey: (student: Student, area: ParsedHansonFile) =>
		JSON.stringify([student.id, area]),
	maxAge: 60000,
})

export {memoized as checkStudentAgainstArea}