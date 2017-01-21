// @flow
export default {
	path: 'drive',
	getComponent(location, cb) {
		require.ensure([], () => {
			cb(null, require('./drive').default)
		}, 'new-student.drive.component')
	},
}
