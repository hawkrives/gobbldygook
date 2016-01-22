export default {
	path: 'search',
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				sidebar: require('./containers/search-sidebar').default,
			})
		})
	},
}
