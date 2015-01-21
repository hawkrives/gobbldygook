let dest = './dist/'
let src = './app/'

let browserSync = {
	browser: 'google chrome',
	files: `${dest}**`,
	server: {
		baseDir: dest,
	},
}

let lint = [
	`${src}**/*.js`,
	'gulp/**/*.js',
	'test/**/*.js',
]

let sass = {
	src: `${src}styles/**/*.scss`,
	dest: dest,
}

let copy = [
	[`node_modules/sto-courses/**/*`, `${dest}data/courses`, 'courses'],
	[`${src}index.html`, dest, 'markup'],
	[`${src}.htaccess`, dest, 'htaccess'],
	[`${src}images/loading.svg`, `${dest}images`, 'images'],
	[`${src}fonts/*.woff`, `${dest}fonts`, 'fonts'],
]

let browserify = {
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
}

export default {
	browserSync,
	lint,
	sass,
	copy,
	browserify,
}
