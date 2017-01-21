// @flow
export default {
	path: 'upload',
	getComponent(location, cb) {
		require.ensure([], () => {
			cb(null, require('./upload-file').default)
		}, 'new-student.upload.component')
	},
}
