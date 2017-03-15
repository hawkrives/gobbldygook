// @flow
'use strict'
const { NetworkError } = require('./errors')

module.exports.status = status
function status(response /*: Response*/) {
	if (response.status >= 200 && response.status < 300) {
		return response
	}

	throw new Error(response.statusText)
}

module.exports.classifyFetchErrors = classifyFetchErrors
function classifyFetchErrors(err /*: Error*/) {
	if (err instanceof TypeError && err.message === 'Failed to fetch') {
		throw new NetworkError('Failed to fetch')
	}
}

module.exports.json = json
function json(response /*: Response*/) {
	return response.json()
}

module.exports.text = text
function text(response /*: Response*/) {
	return response.text()
}
