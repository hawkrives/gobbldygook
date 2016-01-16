/* globals module */

if (PRODUCTION) {
	module.exports = require('./index-production').default
}
else {
	module.exports = require('./index-development').default
}
