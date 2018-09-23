// @flow
/* global WorkerGlobalScope */

export const IS_WORKER =
	typeof WorkerGlobalScope !== 'undefined' &&
	self instanceof WorkerGlobalScope
