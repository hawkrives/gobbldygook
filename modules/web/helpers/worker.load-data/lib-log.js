// @flow

export default (...args: any[]) =>
    args.length && console.log('worker:load-data', ...args)
