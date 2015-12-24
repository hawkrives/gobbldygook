import uniqueId from 'lodash/utility/uniqueId'
import loadArea from './load-area'
import getStudentData from './get-student-data'

import Worker from './check-student-against-area.worker.js'
const worker = new Worker()
// worker.onmessage = msg => console.log('[main] received message from check-student worker:', msg)
worker.addEventListener('error', msg => console.log('[main] received error from check-student worker:', msg))


function onMessage({sourceId, resolve, reject}, {data}) {
	const [resultId, type, contents] = JSON.parse(data)

	if (resultId === sourceId) {
		worker.removeEventListener('message', onMessage)

		if (type === 'result') {
			resolve(contents)
		}
		else if (type === 'error') {
			reject({_error: contents.message})
		}
	}
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
	const sourceId = uniqueId()

	return new Promise(async (resolve, reject) => {
		worker.addEventListener('message', onMessage.bind(null, {sourceId, resolve, reject}))

		const areaData = {
			...area,
		}
		try {
			areaData.data = await loadArea(area)
		}
		catch (err) {
			console.error(err)
			return
		}

		let studentData
		try {
			studentData = await getStudentData(student)
		}
		catch (err) {
			console.error(err)
			return
		}

		/* why stringify? from https://code.google.com/p/chromium/issues/detail?id=536620#c11:
		 > We know that serialization/deserialization is slow. It's actually faster to
		 > JSON.stringify() then postMessage() a string than to postMessage() an object. :(
		 */
		worker.postMessage(JSON.stringify([sourceId, studentData, areaData]))
	})
}
