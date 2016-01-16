export default {
	path: 'degub',
	getComponents(cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./components/degub').default,
			})
		})
	},
}
