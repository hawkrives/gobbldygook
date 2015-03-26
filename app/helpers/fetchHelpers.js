import Promise from 'bluebird'

/*eslint-disable no-unused-vars */
function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response)
	}
	else {
		return Promise.reject(new Error(response.statusText))
	}
}

function json(response) {
	return response.json()
}

export {status, json}
/*eslint-enable no-unused-vars */
