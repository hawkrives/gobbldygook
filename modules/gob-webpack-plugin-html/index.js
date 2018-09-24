/* global module */
'use strict'

// Main export
function HJSPlugin(entryName, renderFunc) {
	if (!entryName) {
		throw new Error('entrypoint name is required')
	}

	if (!renderFunc) {
		throw new Error('rendering function is required')
	}

	this.entry = entryName
	this.render = renderFunc
	this.filename = 'index.html'
}

HJSPlugin.prototype.apply = function(compiler) {
	this.compiler = compiler

	compiler.plugin('emit', (compiler, callback) => {
		// store stats on this
		this.stats = compiler.getStats().toJson()
		const context = this.getAssets()

		// access to stats
		context.stats = this.stats

		this.addAssets(compiler, this.render(context))
		callback()
	})
}

// Oddly enough we have to pass in the compiler here
// it's changed from when it was stored on `this` previously
HJSPlugin.prototype.addAssets = function(compiler, data) {
	let pages
	// if it's a string, we assume it's an html string for the index file
	if (typeof data === 'string') {
		pages = {[this.filename]: data}
	} else if (typeof data === 'object') {
		pages = data
	} else {
		let msg = 'Result from `html` callback must be a string or an object'
		throw new Error(msg)
	}

	Object.entries(pages).forEach(([name, asset]) => {
		compiler.assets[name] = {
			source: () => asset,
			size: () => asset.length,
		}
	})
}

HJSPlugin.prototype.getAssets = function() {
	this.assets = this.assets || {}

	Object.entries(this.stats.assetsByChunkName).forEach(([chunk, value]) => {
		// Webpack only outputs an array for each chunk when using sourcemaps
		if (Array.isArray(value)) {
			if (this.entry === chunk) {
				let cssFile = value.find(file => file.endsWith('.css'))
				if (cssFile) {
					this.assets.htmlPluginCss = cssFile
				}

				let jsFile = value.find(file => file.endsWith('.js'))
				if (jsFile) {
					this.assets.htmlPluginJs = jsFile
				}
			}
		}
	})

	return this.assets
}

module.exports = HJSPlugin
