export default {
	path: 'create',
	getIndexRoute(location, cb) {
		require.ensure([], () => {
			cb(null, require('./routes/welcome').default)
		})
	},
	getChildRoutes(location, cb) {
		require.ensure([], () => {
			cb(null, [
				require('./routes/sis').default,    // create/sis
				require('./routes/manual').default, // create/manual
				require('./routes/drive').default,  // create/drive
				require('./routes/upload').default, // create/upload
			])
		})
	},
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./containers/new-student').default,
			})
		})
	},
}
