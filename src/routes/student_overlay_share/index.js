export default {
	path: 'share',
	getComponents(cb) {
		require.ensure([], () => {
			cb(null, {
				overlay: require('./containers/share-student').default,
			})
		})
	},
}
