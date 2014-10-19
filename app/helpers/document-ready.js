'use strict';

import * as Promise from 'bluebird'

let documentReady = new Promise(function(resolve) {
	function onReady() {
		resolve()
		document.removeEventListener('DOMContentLoaded', onReady, true)
		window.removeEventListener('load', onReady, true)
	}

	if (document.readyState === 'complete') {
		resolve()
	} else {
		document.addEventListener('DOMContentLoaded', onReady, true)
		window.addEventListener('load', onReady, true)
	}
})

document.ready = documentReady
export default documentReady
