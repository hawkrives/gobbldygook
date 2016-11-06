/* global chrome:false */
import Bluebird from 'bluebird'
const url = 'https://chrome.google.com/webstore/detail/nhhpgddphdimipafjfiggjnbbmcoklld'

export function installChromeExtension() {
	if (typeof chrome === 'undefined')  {
		return Bluebird.reject(new Error('The `chrome` global does not exist'))
	}
	return new Bluebird((resolve, reject) => {
		chrome.webstore.install(url, resolve, msg => reject(new Error(msg)))
	})
}
