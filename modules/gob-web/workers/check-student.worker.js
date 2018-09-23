// @flow

import debug from 'debug'
import round from 'lodash/round'
import present from 'present'
import {stringifyError} from '@gob/lib'
import {checkStudentAgainstArea} from '@gob/worker-check-student'
import {IS_WORKER} from './lib'
const log = debug('worker:check-student:listener')

declare var self: DedicatedWorkerGlobalScope

function main({data}) {
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
			self.postMessage(JSON.stringify([id, 'error', stringifyError(err)]))
			console.warn(`(${student.name}, ${area.name})`, err)
		})
}

if (IS_WORKER) {
	// $FlowFixMe {data} is not in event… except that it is
	self.addEventListener('message', main)
}

const PointlessExportForFlowAndWebpack: Class<Worker> = (null: any)

export default PointlessExportForFlowAndWebpack
