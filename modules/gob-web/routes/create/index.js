export default {
	path: 'create',

	indexRoute: {
		component: require('./welcome').default,
	},

	getChildRoutes(location, cb) {
		cb(null, [
			{
				path: 'sis',
				getComponent(location, cb) {
					import(/* webpackChunkName: 'new-student.import.component' */ './method-import').then(
						mod => cb(null, mod.default),
					)
				},
			},
			{
				path: 'manual',
				getComponent(location, cb) {
					console.log('hi')
					import(/* webpackChunkName: 'new-student.manual.component' */ './method-manual').then(
						mod => cb(null, mod.default),
					)
				},
			},
			{
				path: 'drive',
				getComponent(location, cb) {
					import(/* webpackChunkName: 'new-student.drive.component' */ './method-drive').then(
						mod => cb(null, mod.default),
					)
				},
			},
			{
				path: 'upload',
				getComponent(location, cb) {
					import(/* webpackChunkName: 'new-student.upload.component' */ './method-upload').then(
						mod => cb(null, mod.default),
					)
				},
			},
		])
	},

	getComponents(location, cb) {
		cb(null, {
			content: require('./new-student').default,
		})
	},
}
