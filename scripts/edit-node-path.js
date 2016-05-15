/* globals __dirname */
process.env.NODE_PATH = require('pkg-dir').sync(__dirname)
require('module').Module._initPaths()
