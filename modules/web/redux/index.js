/* globals module */

if (process.env.NODE_ENV === 'production') {
	module.exports = require('./index-production').default
}
else {
	module.exports = require('./index-development').default
}
