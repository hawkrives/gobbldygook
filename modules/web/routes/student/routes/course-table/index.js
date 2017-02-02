export default {
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('../../../../modules/course-table').default,
			})
		}, 'course-table.components')
	},
}
