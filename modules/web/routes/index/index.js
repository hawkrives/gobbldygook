export default {
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./containers/student-picker').default,
			})
		}, 'student-picker.components')
	},
}
