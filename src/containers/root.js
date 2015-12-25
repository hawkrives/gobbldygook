/* global module */
if (PRODUCTION) {
	module.exports = require('./root-prod').default
}
else {
	module.exports = require('./root-dev').default
}
