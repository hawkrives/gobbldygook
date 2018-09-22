module.exports = {
	presets: [
		'@babel/preset-react',
		'@babel/preset-flow',
		[
			'@babel/preset-env',
			{
				modules: false,
				targets: {
					browsers: [
						'last 2 versions',
						'not android > 0',
						'not ie > 0',
					],
				},
			},
		],
	],
	plugins: [
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-transform-react-display-name',
		['@babel/plugin-transform-runtime', {regenerator: false}],
		'babel-plugin-styled-components',
		// turns `import {sum} from 'lodash'`
		// into `import sum from 'lodash/sum'`
		// "babel-plugin-lodash",
	],
	env: {
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
		},
	},
}
