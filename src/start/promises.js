// apply global overrides stuff here
global.Promise = require('bluebird')
require('babel-runtime/core-js/promise').default = require('bluebird')
