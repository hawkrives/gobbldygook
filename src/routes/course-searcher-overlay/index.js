export default {
	path: 'search',
	getComponents(cb) {
		require.ensure([], () => {
			cb(null, {
				overlay: require('./containers/course-searcher-overlay').default,
			})
		})
	},
}
