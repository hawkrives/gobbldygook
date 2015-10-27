// apply global overrides stuff here
require('babel-runtime/core-js/promise').default = require('bluebird')
global.Promise = require('bluebird')

if (process.env.NODE_ENV === 'development') {
	global.Promise.config({
		warnings: true,
		longStackTraces: true,
	})
}

// handle promise errors
const throwError = e => {
	e.preventDefault()
	throw e
}

if (typeof window !== 'undefined') {
	window.addEventListener('unhandledrejection', throwError)
	window.addEventListener('rejectionhandled', throwError)
}
