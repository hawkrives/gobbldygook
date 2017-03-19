/* global WorkerGlobalScope */
// @flow

import round from 'lodash/round'
import present from 'present'
import { stringifyError } from '../../../lib/stringify-error'
import checkStudentAgainstArea from './check-student-against-area'
import log from './check-student-against-area/lib-log'

if (
    typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope
) {
    self.addEventListener('message', ({ data }) => {
        const start = present()

        // why stringify? https://code.google.com/p/chromium/issues/detail?id=536620#c11
        // > We know that serialization/deserialization is slow. It's actually faster to
        // > JSON.stringify() then postMessage() a string than to postMessage() an object. :(

        const [id, student, area] = JSON.parse(data)
        log('[check-student] received message:', id, student, area)

        checkStudentAgainstArea(student, area)
            .then(result => {
                self.postMessage(JSON.stringify([id, 'result', result]))
                log(
                    `[check-student(${student.name}, ${area.name})] took ${round(present() - start)} ms`
                )
            })
            .catch(err => {
                self.postMessage(
                    JSON.stringify([id, 'error', stringifyError(err)])
                )
                log(`[check-student(${student.name}, ${area.name}))]`, err)
            })
    })
}
