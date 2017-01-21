// @flow
export default {
	path: 'share',
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				overlay: require('./containers/share-student').default,
			})
		}, 'share-student.components')
	},
}
