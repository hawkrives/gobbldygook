// @flow

export default {
	path: 'search',
	getComponents(state: mixed, cb: Function) {
		(require: any).ensure(
			[],
			() => {
				cb(null, {
					overlay: require('./course-searcher-overlay').default,
				})
			},
			'course-overlay.components',
		)
	},
}
