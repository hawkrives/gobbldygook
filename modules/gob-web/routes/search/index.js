// @flow

export default {
	path: 'search',
	getComponents(state: mixed, cb: Function) {
		import(/* webpackChunkName: 'course-overlay.components' */ './course-searcher-overlay').then(
			mod => cb(null, {overlay: mod.default}),
		)
	},
}
