var Promise = require('bluebird')

module.exports = new Promise(function(resolve) {
	if (document.readyState === 'complete') {
		resolve()
	} else {
		function onReady() {
			resolve()
			document.removeEventListener('DOMContentLoaded', onReady, true)
			window.removeEventListener('load', onReady, true)
		}
		document.addEventListener('DOMContentLoaded', onReady, true)
		window.addEventListener('load', onReady, true)
	}
})
