// @flow

import debug from 'debug'
const log = debug('worker:load-data:dispatch')

export default function dispatch(type: string, action: string, ...args: any[]) {
    log([null, 'dispatch', { type, action, args }])
    self.postMessage([null, 'dispatch', { type, action, args }])
}
