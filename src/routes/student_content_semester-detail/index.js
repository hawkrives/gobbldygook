export default {
	path: 'semester/:year/:semester',
	getComponents(cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./containers/semester-detail').default,
			})
		})
	},
}
