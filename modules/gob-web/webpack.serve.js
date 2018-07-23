'use strict'

const serve = require('webpack-serve')
const argv = {}
const config = require('./webpack.config.js')

serve(argv, {config: config({mode: 'development'})}).catch(() =>
	process.exit(1),
)
