var Q = require("q")

function xhrSuccess(req) {
	return (req.status === 200 || (req.status === 0 && req.responseText));
}

function read(url) {
	var request = new XMLHttpRequest();
	var response = Q.defer();

	function onload() {
		if (xhrSuccess(request)) {
			response.resolve(request.responseText);
		} else {
			onerror();
		}
	}

	function onerror() {
		response.reject("Can't XHR " + JSON.stringify(url));
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
		response.reject(exception.message, exception);
	}

	request.send();
	return response.promise;
};

module.exports = read
