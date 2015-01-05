var dest = './dist/';
var src = './app/';

module.exports = {
	browserSync: {
		browser: 'google chrome',
		server: {
			baseDir: dest
		},
		files: [
			dest + '**/*',
			'!' + dest + '**.map', // Exclude sourcemaps
		],
	},

	lint: [
		src + '**/*.{js,es6}',
		'./gulp/**/*.js',
	],

	link: {
		paths: [
			['./node_modules/sto-courses', dest + 'data/courses'],
			['./data/areas', dest + 'data/areas'],
			['./app', './node_modules/app'],
			['./mockups', './node_modules/sto-areas'],
		],
		opts: {force: true},
	},

	sass: {
		src: src + 'styles/**/*.scss',
		dest: dest,
	},

	fonts: {
		src: [src + 'fonts/*.woff', src + 'icons/font/*.woff'],
		dest: dest + 'fonts',
	},

	copy: [
		[src + 'index.html', dest],
		[src + '.htaccess', dest],
		[src + 'images/loading.svg', dest + 'images'],
	],

	browserify: {
		// Enable source maps
		debug: true,
		// Additional file extentions to make optional
		// extensions: ['.es6'],
		// A separate bundle will be generated for each
		// bundle config in the list below
		bundleConfigs: [{
			entries: src + 'index.js',
			dest: dest,
			outputName: 'app.js',
			mapFile: dest + 'app.js.map',
		}],
	},
};
