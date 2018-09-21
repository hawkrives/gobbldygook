// @flow

const id = '227069'

export function installExtension() {
	if (typeof global.opr === 'undefined') {
		return Promise.reject('The `opr` global does not exist')
	}
	return new Promise((resolve, reject) => {
		global.opr.addons.installExtension(id, resolve, reject)
	})
}
