export default {
	path: 'share',
	getComponents(location, cb) {
		require.ensure([], () => {
			cb(null, {
				overlay: require('./share-student').default,
			})
		}, 'share-student.components')
	},
}
