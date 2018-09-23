// @flow

import uniqueId from 'lodash/uniqueId'
import debug from 'debug'
import CheckStudentWorker from './check-student.worker'

import type {
	HydratedAreaOfStudyType,
	AreaOfStudyEvaluationError,
	AreaOfStudyType,
	HydratedStudentType,
} from '@gob/object-student'

const log = debug('worker:check-student:main')

// flow thinks that a `new Worker` needs an URL… which is true, except that
// Webpack does that for us
// $FlowFixMe
const worker = new CheckStudentWorker()

worker.addEventListener('error', function(event: Event) {
	log('received error from check-student worker:', event)
})

type Result = HydratedAreaOfStudyType | AreaOfStudyEvaluationError

// Checks a student object against an area of study.
export function checkStudentAgainstArea(
	student: HydratedStudentType,
	area: AreaOfStudyType,
): Promise<Result> {
	return new Promise(resolve => {
		const sourceId = uniqueId()

		// This is inside of the function so that it doesn't get unregistered too early
		function onMessage({data}) {
			const [resultId, type, contents] = JSON.parse(data)

			if (resultId === sourceId) {
				// $FlowFixMe flow doesn't like … unbinding this?
				worker.removeEventListener('message', onMessage)

				if (type === 'result') {
					resolve(contents)
				} else if (type === 'error') {
					resolve({_error: contents.message})
				}
			}
		}

		worker.addEventListener('message', onMessage)

		/* why stringify? from https://code.google.com/p/chromium/issues/detail?id=536620#c11:
		 * > We know that serialization/deserialization is slow. It's actually faster to
		 * > JSON.stringify() then postMessage() a string than to postMessage() an object. :(
		 */
		worker.postMessage(JSON.stringify([sourceId, student, area]))
	})
}
