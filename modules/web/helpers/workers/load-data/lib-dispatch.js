// @flow

export default function dispatch(type: string, action: string, ...args: any[]) {
    self.postMessage([null, 'dispatch', { type, action, args }])
}
