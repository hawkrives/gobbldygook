export default {
	getComponents(cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./containers/course-table').default,
			})
		})
	},
}
