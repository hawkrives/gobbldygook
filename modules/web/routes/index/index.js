export default {
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('../../modules/student-picker').default,
			})
		}, 'student-picker.components')
	},
}
