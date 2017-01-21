// @flow
export default {
	path: 'sis',
	getComponent(location, cb) {
		require.ensure([], () => {
			cb(null, require('./sis-import').default)
		}, 'new-student.import.component')
	},
}
