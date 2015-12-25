/* global module */
if (process.env.NODE_ENV === 'production') {
	module.exports = require('./root-prod').default
}
else {
	module.exports = require('./root-dev').default
}
