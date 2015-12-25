/* global module */
'use strict'

module.exports = function buildFilename(pkg, hash, ext) {
	return [
		pkg.name,
		// extract-text-plugin uses [contenthash] and webpack uses [hash]
		hash ? (ext === 'css' ? '[contenthash]' : '[hash]') : pkg.version,
		ext || 'js',
	].join('.')
}
