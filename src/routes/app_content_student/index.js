export default {
	path: 's/:studentId',

	getIndexRoute(location, cb) {
		require.ensure([], () => {
			cb(null, require('../student_content_course-table').default)
		})
	},

	getChildRoutes(state, cb) {
		require.ensure([], () => {
			cb(null, [
				require('../student_overlay_share').default, // share
				require('../student_sidebar_search').default, // search
				require('../student_content_semester-detail').default, // :year/:term
			])
		})
	},

	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {content: require('./containers/student').default})
		})
	},
}
