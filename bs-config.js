module.exports = {
	// browser: 'google chrome',
	open: false,
	files: ['build/*.css', 'build/*.js', 'build/*.html'],
	server: {
		baseDir: './build',
		routes: {
			'/areas': './area-data',
		}
	},
	notify: false,
}
