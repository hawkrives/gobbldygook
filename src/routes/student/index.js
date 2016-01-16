export default {
	path: 's/:studentId',
	getIndexRoute(location, cb) {
		require.ensure([], () => {
			cb(null, require('./routes/course-table').default)
		})
	},
	getChildRoutes(state, cb) {
		require.ensure([], () => {
			cb(null, [
				require('./routes/share-overlay').default, // share
				require('./routes/course-searcher-sidebar').default, // search
				require('./routes/semester-detail').default, // :year/:term
				require('../course-overlay').default, // course/:clbid
			])
		})
	},
	getComponent(cb) {
		require.ensure([], () => {
			cb(null, require('./containers/student').default)
		})
	},
}
