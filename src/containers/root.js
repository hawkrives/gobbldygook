/* global module */
if (process.env.NODE_ENV === 'production') {
	module.exports = require('./root-production')
}
else {
	module.exports = require('./root-development')
}
