var read = require('./read')

function readJson(url) {
	return read(url)
		.then(JSON.parse)
		.catch(function(err) {
			console.log('JSON parsing failed', err)
		}
	)
}

module.exports = readJson
