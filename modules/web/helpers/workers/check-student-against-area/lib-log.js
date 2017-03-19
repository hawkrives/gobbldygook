// @flow

const log = (...args: any[]) =>
    args.length && console.log('worker:check-student-against-area', ...args)

export default log
