export default {
	path: 'create',
	getComponents(cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./containers/new-student-wizard').default,
			})
		})
	},
}
