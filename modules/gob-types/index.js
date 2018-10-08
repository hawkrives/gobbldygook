// @flow

export {Course, Offering} from './course'

export type Result<T> =
	| {error: false, result: T, meta?: Object}
	| {error: true, result: Error, meta?: Object}
