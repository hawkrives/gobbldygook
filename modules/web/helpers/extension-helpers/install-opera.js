/* global opr:false */
const id = '227069'

export function installOperaExtension() {
	if (typeof opr === 'undefined')  {
		return Promise.reject('The `opr` global does not exist')
	}
	return new Promise((resolve, reject) => {
		opr.addons.installExtension(id, resolve, reject)
	})
}
