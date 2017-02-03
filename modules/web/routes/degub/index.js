export default {
	path: 'degub',
	getComponents(state, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./degub').default,
			})
		}, 'degub.components')
	},
}
