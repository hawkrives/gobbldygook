export default {
	path: 'semester/:year/:semester',
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('../../../../modules/semester-detail').default,
			})
		}, 'semester-detail.components')
	},
}
