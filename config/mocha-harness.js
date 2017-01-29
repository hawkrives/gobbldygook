global.fetch = () => Promise.resolve({})

global.localStorage = {
	_storage: {},
	getItem(key) {
		if (!this.hasItem(key)) {
			return null
		}
		return this._storage[key]
	},
	setItem(key, val) {
		this._storage[key] = String(val)
	},
	removeItem(key) {
		delete this._storage[key]
	},
	hasItem(key) {
		return key in this._storage
	},
	clear() {
		this._storage = {}
	},
}
