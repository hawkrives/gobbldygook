global.Promise = require('bluebird')
global.debug = require('debug')

global.VERSION = String(require('../package.json').version)
global.DEV = false

process.env.NODE_ENV = 'test'

let storage = {}
global.localStorage = {
	_storage: storage,
	getItem: key => storage[key],
	setItem: (key, val) => storage[key] = val,
	removeItem: key => delete storage[key],
	hasItem: key => key in storage,
	clear: () => {
		storage = {}
	},
}

require.extensions['.scss'] = function () {
	return null
}

require.extensions['.css'] = function () {
	return null
}
