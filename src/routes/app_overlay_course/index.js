export default {
	path: 'course/:clbid',
	getComponents(cb) {
		require.ensure([], () => {
			cb(null, {
				overlay: require('./containers/course-overlay').default,
			})
		})
	},
}
