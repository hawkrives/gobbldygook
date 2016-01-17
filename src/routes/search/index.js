export default {
	path: 'search',
	getComponents(state, cb) {
		require.ensure([], () => {
			cb(null, {
				overlay: require('./containers/course-searcher-overlay').default,
			})
		})
	},
}
