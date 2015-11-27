global.Promise = require('bluebird')
global.debug = require('debug')

global.VERSION = String(require('../package.json').version)
global.DEV = false

let storage = new Map()
global.localStorage = {
	_storage: storage,
	getItem: key => storage.get(key),
	setItem: (key, val) => storage.set(key, val),
	removeItem: key => storage.delete(key),
	hasItem: key => storage.has(key),
	clear: () => {
		storage = new Map()
	},
}

require.extensions['.scss'] = function () {
	return null
}

require.extensions['.css'] = function () {
	return null
}
