// @flow

export default {
	path: 'degub',
	getComponents(state: mixed, cb: Function) {
		import(/* webpackChunkName: 'degub.components' */ './degub').then(mod =>
			cb(null, {content: mod.default}),
		)
	},
}
