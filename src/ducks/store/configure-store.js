/* globals module */

if (PRODUCTION) {
	module.exports = require('./production').default
}
else {
	module.exports = require('./development').default
}
