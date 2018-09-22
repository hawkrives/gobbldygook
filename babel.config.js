module.exports = {
	"presets": [
		"react",
		"flow",
		["env", {
			"modules": false,
			"targets": {
				"browsers": [
					"last 2 versions",
					"not android > 0",
					"not ie > 0"
				]
			}
		}]
	],
	"plugins": [
		"transform-class-properties",
		"transform-object-rest-spread",
		"transform-react-display-name",
		"babel-plugin-styled-components",
		["transform-runtime", {"polyfill": false, "regenerator": false}]
		// turns `import {sum} from 'lodash'`
		// into `import sum from 'lodash/sum'`
		// "lodash",
	],
	"env": {
		"test": {
			"presets": [
				["env", {
					"targets": {"node": true},
					"modules": "commonjs"
				}]
			]
		}
	}
}
