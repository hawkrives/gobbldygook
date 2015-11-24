import uniqueId from 'lodash/utility/uniqueId'

import Worker from './check-student-against-area.worker.js'
const worker = new Worker()
// worker.onmessage = msg => console.log('[main] received message from check-student worker:', msg)
worker.onerror = msg => console.log('[main] received error from check-student worker:', msg)

import {getStudentData} from '../models/student'

/**
 * Checks a student object against an area of study.
 *
 * @param {Object} student - the student to check
 * @param {Object} area - the area to check against
 * @returns {Promise} - the promise for a result
 * @promise ResultsPromise
 * @fulfill {Object} - The details of the area check.
 */
export default function checkStudentAgainstArea(student, area) {
	return new Promise((resolve, reject) => {
		const sourceId = uniqueId()

		function onMessage({data}) {
			const [resultId, type, contents] = data

			if (resultId === sourceId) {
				worker.removeEventListener('message', onMessage)

				if (type === 'result') {
					resolve(contents)
				}
				else if (type === 'error') {
					reject(contents)
				}
			}
		}

		worker.addEventListener('message', onMessage)

		area.data
			.then(areaData => {
				return Promise.all([
					getStudentData(student),
					{...area.toJS(), data: areaData},
				])
			})
			.then(([student, area]) => {
				// console.log(sourceId, student, area)
				// why stringify? https://code.google.com/p/chromium/issues/detail?id=536620#c11
				// > We know that serialization/deserialization is slow. It's actually faster to
				// > JSON.stringify() then postMessage() a string than to postMessage() an object. :(
				worker.postMessage(JSON.stringify([sourceId, student, area]))
			})
			.catch(err => console.error(err))
	})
}
