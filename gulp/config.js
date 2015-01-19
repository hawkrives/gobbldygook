let dest = './dist/'
let src = './app/'

export default {
	browserSync: {
		browser: 'google chrome',
		server: {
			baseDir: dest,
		},
	},

	lint: [
		`${src}**/*.js`,
		'gulp/**/*.js',
		'test/**/*.js',
	],

	sass: {
		src: `${src}styles/**/*.scss`,
		dest: dest,
	},

	copy: [
		[`node_modules/sto-courses/**/*`, `${dest}data/courses`, 'courses'],
		[`${src}index.html`, dest, 'markup'],
		[`${src}.htaccess`, dest, 'htaccess'],
		[`${src}images/loading.svg`, `${dest}images`, 'images'],
		[`${src}fonts/*.woff`, `${dest}fonts`, 'fonts'],
		[`${src}icons/font/*.woff`, `${dest}fonts`, 'icons'],
	],

	browserify: {
		// A separate bundle will be generated for each
		// bundle config in the list below
		bundleConfigs: [{
			entries: `${src}index.js`,
			dest: dest,
			// Additional file extentions to make optional
			// extensions: ['.es6'],
			outputName: 'app.js',
			mapFile: `${dest}app.js.map`,
		}],
	},
}
