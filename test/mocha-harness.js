global.Promise = require('bluebird')
global.debug = require('debug')

require('babel-regenerator-runtime')

global.VERSION = String(require('../package.json').version)
global.DEVELOPMENT = false
global.PRODUCTION = false
global.TESTING = true

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
