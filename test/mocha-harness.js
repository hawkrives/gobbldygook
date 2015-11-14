global.Promise = require('bluebird')
global.debug = require('debug')

global.VERSION = JSON.stringify(require('../../package.json').version)
global.DEV = false
