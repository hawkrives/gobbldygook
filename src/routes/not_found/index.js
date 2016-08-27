export default {
	path: '*',

	getComponents(location, cb) {
		require.ensure([], require => {
			cb(null, {
				content: require('./not-found').default,
			})
		}, 'not-found.components')
	},
}
