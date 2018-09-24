module.exports = {
	presets: [
		'@babel/preset-react',
		'@babel/preset-flow',
		[
			'@babel/preset-env',
			{
				modules: false,
				useBuiltIns: 'entry',
				targets: {
					esmodules: true,
				},
			},
		],
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-transform-react-display-name',
		[
			'@babel/plugin-transform-runtime',
			{
				regenerator: false,
				useESModules: true,
			},
		],
		'babel-plugin-styled-components',
		// turns `import {sum} from 'lodash'`
		// into `import sum from 'lodash/sum'`
		// "babel-plugin-lodash",
	],
	env: {
		production: {
			plugins: ['babel-plugin-transform-react-remove-prop-types'],
		},
		test: {
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {node: true},
						modules: 'commonjs',
					},
				],
			],
			plugins: [
				[
					'@babel/plugin-transform-runtime',
					{
						regenerator: false,
						useESModules: false,
					},
				],
			],
		},
	},
}
