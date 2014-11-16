'use strict';

import read from './read.es6'

function readJson(url) {
	return read(url)
		.then(JSON.parse)
		.catch(function(err) {
			console.log('JSON parsing failed', err)
		}
	)
}

export default readJson
