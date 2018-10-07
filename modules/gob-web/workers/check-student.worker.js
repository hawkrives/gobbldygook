// @flow

import prettyMs from 'pretty-ms'
import present from 'present'
import {stringifyError} from '@gob/lib'
import {checkAgainstArea} from '@gob/worker-check-student'
import {IS_WORKER} from './lib'

declare var self: DedicatedWorkerGlobalScope

function main({data}) {
	const start = present()

	// why stringify? https://code.google.com/p/chromium/issues/detail?id=536620#c11
	// > We know that serialization/deserialization is slow. It's actually faster to
	// > JSON.stringify() then postMessage() a string than to postMessage() an object. :(

	const {id, area, courses, fulfillments, overrides, name} = JSON.parse(data)
	// console.log('received message:', id, student, area)

	try {
		let result = checkAgainstArea(area, {courses, fulfillments, overrides})
		self.postMessage(JSON.stringify({id, type: 'result', data: result}))
		const taken = prettyMs(present() - start)
		console.log(`(${name}, ${area.name}) took ${taken}`)
	} catch (error) {
		let err = stringifyError(error)
		self.postMessage(JSON.stringify({id, type: 'error', data: err}))
		console.warn(`(${name}, ${area.name})`, error)
	}
}

if (IS_WORKER) {
	// $FlowFixMe {data} is not in event… except that it is
	self.addEventListener('message', main)
}

class PointlessExportForTestingAndFlow {
	addEventListener(_1: string, _2: Function) {}
	removeEventListener(_1: string, _2: Function) {}
	postMessage(_: string) {}
}

export default PointlessExportForTestingAndFlow
