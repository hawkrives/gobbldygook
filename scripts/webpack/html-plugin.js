/* global module */
'use strict'

const forEach = require('lodash/forEach')

// Main export
function HJSPlugin(renderFunc) {
	this.render = renderFunc
	this.filename = 'index.html'
}

HJSPlugin.prototype.apply = function(compiler) {
	const htmlFunction = this.render

	// let user pass `true` to use the simple default.
	// Same if `isDev` and `serveCustomHtmlInDev` is falsy
	if (!htmlFunction) {
		return
	}

	this.compiler = compiler

	compiler.plugin('emit', (compiler, callback) => {
		// store stats on this
		this.stats = compiler.getStats().toJson()
		const context = this.getAssets()

		// access to stats
		context.stats = this.stats

		this.addAssets(compiler, htmlFunction(context))
		callback()
	})
}

// Oddly enough we have to pass in the compiler here
// it's changed from when it was stored on `this` previously
HJSPlugin.prototype.addAssets = function(compiler, data) {
	const dataType = typeof data
	let pages
	// if it's a string, we assume it's an html string for the index file
	if (dataType === 'string') {
		pages = {
			[this.filename]: data,
		}
	}
	else if (dataType === 'object') {
		pages = data
	}
	else {
		throw new Error('Result from `html` callback must be a string or an object')
	}

	forEach(pages, (asset, name) => {
		compiler.assets[name] = {
			source: () => asset,
			size: () => asset.length,
		}
	})
}

HJSPlugin.prototype.getAssets = function() {
	const assets = this.assets = {}

	forEach(this.stats.assetsByChunkName, (value, chunk) => {
		// Webpack outputs an array for each chunk when using sourcemaps
		if (value instanceof Array) {
			// if we've got a CSS file add it here
			if (chunk === 'main' && value.length >= 2) {
				assets.css = value[1]
			}

			// The main bundle seems like it's always the first
			value = value[0]
		}

		assets[chunk] = value
	})

	return assets
}

module.exports = HJSPlugin
