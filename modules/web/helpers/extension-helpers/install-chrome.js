// @flow
/* global chrome:false */
const url = 'https://chrome.google.com/webstore/detail/nhhpgddphdimipafjfiggjnbbmcoklld'

export function installChromeExtension() {
	if (typeof chrome === 'undefined')  {
		return Promise.reject(new Error('The `chrome` global does not exist'))
	}
	return new Promise((resolve, reject) => {
		chrome.webstore.install(url, resolve, msg => reject(new Error(msg)))
	})
}
