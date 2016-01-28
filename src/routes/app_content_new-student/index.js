export default {
	path: 'create',
	getIndexRoute(location, cb) {
		require.ensure([], () => {
			cb(null, require('./routes/welcome').default)
		}, 'new-student.index')
	},
	getChildRoutes(location, cb) {
		require.ensure([], () => {
			cb(null, [
				require('./routes/sis').default,    // create/sis
				require('./routes/manual').default, // create/manual
				require('./routes/drive').default,  // create/drive
				require('./routes/upload').default, // create/upload
			])
		}, 'new-student.routes')
	},
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./containers/new-student').default,
			})
		}, 'new-student.components')
	},
}
