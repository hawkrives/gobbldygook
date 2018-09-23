export default {
	path: 's/:studentId',

	getIndexRoute(location, cb) {
		import(/* webpackChunkName: 'course-table.components' */ '../../modules/course-table').then(
			mod => cb(null, {content: mod.default}),
		)
	},

	getChildRoutes(state, cb) {
		cb(null, [
			{
				path: 'search(/:year)(/:semester)',
				getComponents(location, cb) {
					import(/* webpackChunkName: 'search-sidebar.components' */ './search-sidebar').then(
						mod => cb(null, {sidebar: mod.default}),
					)
				},
			},
			{
				path: 'share',
				getComponents(location, cb) {
					import(/* webpackChunkName: 'share-student.components' */ './share-student').then(
						mod => cb(null, {overlay: mod.default}),
					)
				},
			},
			{
				path: 'semester/:year/:semester',
				getComponents(location, cb) {
					import(/* webpackChunkName: 'semester-detail.components' */ '../../modules/semester-detail').then(
						mod => cb(null, {content: mod.default}),
					)
				},
			},
		])
	},

	getComponents(location, cb) {
		import(/* webpackChunkName: 'student.components' */ '../../modules/student').then(
			mod => cb(null, {content: mod.default}),
		)
	},
}
