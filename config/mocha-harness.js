global.Promise = require('bluebird')

global.VERSION = String(require('../package.json').version)
global.DEVELOPMENT = false
global.PRODUCTION = false
global.TESTING = true

global.fetch = () => Promise.resolve({})

let storage = {}
global.localStorage = {
	_storage: storage,
	getItem: key => {
		if (!localStorage.hasItem(key)) {
			return null
		}
		return storage[key]
	},
	setItem: (key, val) => {
		return storage[key] = String(val)
	},
	removeItem: key => {
		delete storage[key]
	},
	hasItem: key => {
		return key in storage
	},
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
