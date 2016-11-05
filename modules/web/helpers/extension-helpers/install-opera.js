/* global opr:false */
import Bluebird from 'bluebird'
const id = '227069'

export function installOperaExtension() {
	if (typeof opr === 'undefined')  {
		return Bluebird.reject('The `opr` global does not exist')
	}
	return new Bluebird((resolve, reject) => {
		opr.addons.installExtension(id, resolve, reject)
	})
}
