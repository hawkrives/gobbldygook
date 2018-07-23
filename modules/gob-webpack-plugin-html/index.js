/* global module */
'use strict'

class HJSPlugin {
	constructor(renderFunc) {
		this.render = renderFunc
		this.filename = 'index.html'

		this.apply = this.apply.bind(this)
		this.emit = this.emit.bind(this)
		this.getAssets = this.getAssets.bind(this)
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync({name: 'HtmlPlugin'}, this.emit)
	}

	emit(compilation, cb) {
		// console.log(compilation.namedChunks)
		let context = this.getAssets(compilation.namedChunks)
		// console.log(context)
		// process.exit(1)

		let data = this.render(context)
		compilation.assets[this.filename] = {
			source: () => data,
			size: () => data.length,
		}

		cb()
	}

	getAssets(namedChunks) {
		const assets = (this.assets = {})

		for (let [chunkName, chunk] of namedChunks.entries()) {
			// Webpack outputs an array for each chunk when using sourcemaps
			if (Array.isArray(chunk.files)) {
				// if we've got a CSS file add it here
				// if (chunkName === 'main' && chunk.files.length >= 2) {
				// 	assets.css = chunk.files[1]
				// }

				// The main bundle seems like it's always the first
				chunk = chunk.files.find(f => f.endsWith('.js'))
			}

			assets[chunkName] = chunk
		}

		return assets
	}
}

module.exports = HJSPlugin
