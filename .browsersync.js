/* eslint module:true */

module.exports = {
	// the files to watch
	files: ['build/*.{js,css}'],

	// config for the built-in web server
	server: {
		baseDir: './build',
		routes: {
			'/areas': './area-data',
		},
	},

	// don't automatically open any browsers
	open: false,

	// don't show notifications in the browser when something changes
	notify: false,

	// when browsersync restarts, reload all connected browsers
	reloadOnRestart: true,
}
