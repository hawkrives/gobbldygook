/* global chrome:false */
import Bluebird from 'bluebird'
const url = 'https://chrome.google.com/webstore/detail/hrefnhhpgddphdimipafjfiggjnbbmcoklld'

export function installChromeExtension() {
	if (typeof chrome === 'undefined')  {
		return Bluebird.reject('The `chrome` global does not exist')
	}
	return new Bluebird((resolve, reject) => {
		chrome.webstore.install(url, resolve, reject)
	})
}
