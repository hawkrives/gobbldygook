/* global module */
'use strict'

const config = require('../../.webpackrc.js')
const HtmlPlugin = require('../../scripts/webpack/html-plugin')

config.port = 3010
config.entry = ['./index.js']
config.output = {
	path: './',
	filename: 'bundle.js',
}

const reject = require('lodash/collection/reject')
config.plugins = reject(config.plugins, p => p instanceof HtmlPlugin)

config.plugins.push(new HtmlPlugin({
	html(context) {
		return {
			'index.html': [
				'<!DOCTYPE html>',
				'<html lang="en-US">',
				'<meta charset="UTF-8">',
				'<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
				'<title>Notifications</title>',
				context.css && `<link rel="stylesheet" href="${context.css}">`,
				'<body>',
				'  <main id="container"></main>',
				'</body>',
				`<script src="${context.main}"></script>`,
				'</html>',
			].join('\n'),
		}
	},
	isDev: true,
}))

module.exports = config
