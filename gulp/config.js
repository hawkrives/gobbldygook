var dest = './dist';
var src = './app';

module.exports = {
	browserSync: {
		notify: true,
		minify: false,
		browser: 'google chrome',
		server: {
			// We're serving the src folder as well,
			// for sass sourcemap linking
			baseDir: [dest, src]
		},
		files: [
			dest + '/**',
			'!' + dest + '/**.map', // Exclude Map files
		]
	},
	lint: {
		src: [
			src + '/**/*.{js,es6}',
			'./gulp/**/*.js',
		],
	},
	link: {
		src: 'data',
		dest: dest + '/data',
		opts: {force: true},
	},
	del: {
		dest: dest,
	},
	sass: {
		src: src + '/styles/**/*.scss',
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
		src: [src + '/fonts/*.woff', src + '/icons/font/*.woff'],
		dest: dest + '/fonts'
	},
	markup: {
		src: src + '/index.html',
		dest: dest
	},
	browserify: {
		// Enable source maps
		debug: true,
		// Additional file extentions to make optional
		// extensions: ['.es6'],
		// A separate bundle will be generated for each
		// bundle config in the list below
		bundleConfigs: [{
			entries: src + '/app.es6',
			dest: dest,
			outputName: 'app.js',
			mapfile: dest + '/app.js.map',
			transforms: ['6to5-browserify'],
		}]
	}
};
