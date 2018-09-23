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
					require.ensure(
						[],
						() => {
							cb(null, {
								sidebar: require('./search-sidebar').default,
							})
						},
						'search-sidebar.components',
					)
				},
			},
			{
				path: 'share',
				getComponents(location, cb) {
					require.ensure(
						[],
						() => {
							cb(null, {
								overlay: require('./share-student').default,
							})
						},
						'share-student.components',
					)
				},
			},
			{
				path: 'semester/:year/:semester',
				getComponents(location, cb) {
					require.ensure(
						[],
						() => {
							cb(null, {
								content: require('../../modules/semester-detail')
									.default,
							})
						},
						'semester-detail.components',
					)
				},
			},
		])
	},

	getComponents(location, cb) {
		require.ensure(
			[],
			() => {
				cb(null, {content: require('../../modules/student').default})
			},
			'student.components',
		)
	},
}
