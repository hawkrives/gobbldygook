export default {
	path: 'search',
	getComponents(cb) {
		require.ensure([], () => {
			cb(null, {
				sidebar: require('../../containers/course-searcher').default,
			})
		})
	},
}
