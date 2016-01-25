export default {
	path: 'create',
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./containers/new-student').default,
			})
		})
	},
}
