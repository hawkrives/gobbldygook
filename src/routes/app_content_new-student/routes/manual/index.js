export default {
	path: 'manual',
	getComponent(location, cb) {
		require.ensure([], () => {
			cb(null, require('./manual').default)
		})
	},
}
