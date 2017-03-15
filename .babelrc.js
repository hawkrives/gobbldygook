module.exports = {
	"presets": [
		// JSX, Flow
		"react",
		// Latest stable ECMAScript features
		["env", {
			"targets": {
				"ie": 12,
				"browsers": "last 2 versions, Firefox ESR",
			},
			"modules": false,
		}],
	],
	"plugins": [
		"transform-class-properties",
		"transform-object-rest-spread",
		"transform-react-display-name",
		["transform-runtime", {"polyfill": false}],
		// turns `import {sum} from 'lodash'`
		// into `import sum from 'lodash/sum'`
		// "lodash",
	],
	"env": {
		"production": {
			// "presets": ["babili"],
			"plugins": [
				"transform-react-constant-elements",
				"transform-react-inline-elements",
				"transform-inline-environment-variables",
			],
		},
		"test": {
			"presets": [
				["env", {
					"targets": {"node": true},
					"modules": "commonjs",
				}]
			],
		},
	},
}
