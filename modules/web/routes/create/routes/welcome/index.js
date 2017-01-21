// @flow
export default {
	getComponent(location, cb) {
		require.ensure([], () => {
			cb(null, require('./welcome').default)
		}, 'new-student.welcome.component')
	},
}
