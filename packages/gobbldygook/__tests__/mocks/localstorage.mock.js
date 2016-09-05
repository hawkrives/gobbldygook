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
