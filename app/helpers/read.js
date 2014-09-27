'use strict';

var Promise = require("bluebird")

function xhrSuccess(req) {
	return (req.status === 200 || (req.status === 0 && req.responseText));
}

function read(url) {
	return new Promise(function(resolve, reject) {
		var request = new XMLHttpRequest();
		
		function onload() {
			if (xhrSuccess(request)) {
				resolve(request.responseText);
			} else {
				onerror();
			}
		}

		function onerror() {
			reject("Can't XHR " + JSON.stringify(url));
		}

		try {
			request.open("GET", url, true);
			request.onreadystatechange = function () {
				if (request.readyState === 4) {
					onload();
				}
			};
			request.onload = request.load = onload;
			request.onerror = request.error = onerror;
		} catch (exception) {
			reject(exception.message, exception);
		}

		request.send();
	})
}

module.exports = read
