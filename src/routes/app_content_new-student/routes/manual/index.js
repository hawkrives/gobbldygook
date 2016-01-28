export default {
	path: 'manual',
	getComponent(location, cb) {
		require.ensure([], () => {
			cb(null, require('./manual').default)
		}, 'new-student.manual.component')
	},
}
