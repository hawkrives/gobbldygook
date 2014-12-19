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
			'!' + dest + '**.map', // Exclude Map files
		]
	},

	lint: {
		src: [
			src + '**/*.{js,es6}',
			'./gulp/**/*.js',
		],
	},

	link: {
		src: ['./node_modules/sto-courses', './data/areas'],
		dest: [dest + 'data/courses', dest + 'data/areas'],
		opts: {force: true},
	},

	sass: {
		src: src + 'styles/**/*.scss',
		dest: dest,
		AUTOPREFIXER_BROWSERS: [
			'ie >= 11',
			'ie_mob >= 11',
			'ff >= 33',
			'chrome >= 37',
			'safari >= 8',
			'opera >= 25',
			'ios >= 8',
			'android >= 4.4',
		],
	},

	fonts: {
		src: [src + 'fonts/*.woff', src + 'icons/font/*.woff'],
		dest: dest + 'fonts'
	},

	markup: {
		src: [src + 'index.html', src + '.htaccess'],
		dest: [dest, dest]
	},

	browserify: {
		// Enable source maps
		debug: true,
		// Additional file extentions to make optional
		extensions: ['.es6'],
		// A separate bundle will be generated for each
		// bundle config in the list below
		bundleConfigs: [{
			entries: src + 'index.es6',
			dest: dest,
			outputName: 'app.js',
			paths: [src, './node_modules'],
			mapFile: dest + 'app.js.map',
		}]
	}
};
