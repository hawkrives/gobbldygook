export default {
	path: 'course/:clbid',
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				overlay: require('./containers/course-overlay').default,
			})
		})
	},
}
