export default {
	path: 'semester/:year/:semester',
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./containers/semester-detail').default,
			})
		}, 'semester-detail.components')
	},
}
