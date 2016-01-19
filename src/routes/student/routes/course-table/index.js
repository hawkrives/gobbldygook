export default {
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./containers/course-table').default,
				// content: require('../../containers/blank').default,
			})
		})
	},
}
