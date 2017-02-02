export default {
	path: 'search(/:year)(/:semester)',
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				sidebar: require('./search-sidebar').default,
			})
		}, 'search-sidebar.components')
	},
}
