/* eslint no-var:0 prefer-spread:0 */
/* global module */

var forEach = require('lodash/collection/forEach')

// Main export
function HJSPlugin(options) {
	this.config = options || {}
	this.filename = options.filename || 'index.html'
}

HJSPlugin.prototype.apply = function (compiler) {
	var self = this
	var htmlFunction = this.config.html

	// let user pass `true` to use
	// the simple default
	// Same if `isDev` and `serveCustomHtmlInDev` is falsy
	if (!htmlFunction) {
		return
	}

	self.compiler = compiler

	compiler.plugin('emit', function (compiler, callback) {
		// store stats on self
		self.stats = compiler.getStats().toJson()
		var context = self.getAssets()

		// access to package info
		context.package = self.config.package

		// access to stats
		context.stats = self.stats

		// expose `isDev` flag to html function context
		context.isDev = self.config.isDev

		// handle both sync and async versions
		if (htmlFunction.length === 2) {
			htmlFunction(context, function (err, result) {
				if (err) throw err
				self.addAssets(compiler, result)
				callback()
			})
		}
		else {
			self.addAssets(compiler, htmlFunction(context))
			callback()
		}
	})
}

// Oddly enough we have to pass in the compiler here
// it's changed from when it was stored on `this` previously
HJSPlugin.prototype.addAssets = function (compiler, data) {
	var dataType = typeof data
	var pages
	// if it's a string, we assume it's an html
	// string for the index file
	if (dataType === 'string') {
		pages = {}
		pages[this.filename] = data
	}
	else if (dataType === 'object') {
		pages = data
	}
	else {
		throw new Error('Result from `html` callback must be a string or an object')
	}

	forEach(pages, function(asset, name) {
		compiler.assets[name] = {
			source: function () {
				return asset
			},
			size: function () {
				return asset.length
			},
		}
	})
}

HJSPlugin.prototype.getAssets = function () {
	var assets = this.assets = {}

	forEach(this.stats.assetsByChunkName, function(value, chunk) {
		// Webpack outputs an array for each chunk when using sourcemaps
		if (value instanceof Array) {
			// if we've got a CSS file add it here
			if (chunk === 'main' && value.length >= 2) {
				assets.css = value[1]
			}

			// Is the main bundle seems like it's always the first
			value = value[0]
		}

		assets[chunk] = value
	})

	return assets
}

module.exports = HJSPlugin
