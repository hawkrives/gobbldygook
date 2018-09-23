/* global WorkerGlobalScope */
// @flow

import debug from 'debug'
import round from 'lodash/round'
import present from 'present'
import {stringifyError} from '@gob/lib'
import checkStudentAgainstArea from './source'
const log = debug('worker:check-student:listener')

if (
	typeof WorkerGlobalScope !== 'undefined' &&
	self instanceof WorkerGlobalScope
) {
	self.addEventListener('message', ({data}) => {
		const start = present()

		// why stringify? https://code.google.com/p/chromium/issues/detail?id=536620#c11
		// > We know that serialization/deserialization is slow. It's actually faster to
		// > JSON.stringify() then postMessage() a string than to postMessage() an object. :(

		const [id, student, area] = JSON.parse(data)
		log('received message:', id, student, area)

		checkStudentAgainstArea(student, area)
			.then(result => {
				self.postMessage(JSON.stringify([id, 'result', result]))
				const taken = round(present() - start)
				console.log(`(${student.name}, ${area.name}) took ${taken} ms`)
			})
			.catch(err => {
				self.postMessage(
					JSON.stringify([id, 'error', stringifyError(err)]),
				)
				console.warn(`(${student.name}, ${area.name})`, err)
			})
	})
}

export default class {}
