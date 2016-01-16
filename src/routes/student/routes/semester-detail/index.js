export default {
	path: ':year/:semester',
	getComponents(cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./containers/course-table').default,
			})
		})
	},
}
