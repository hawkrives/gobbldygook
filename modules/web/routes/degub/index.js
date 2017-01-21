// @flow
export default {
	path: 'degub',
	getComponents(state, cb) {
		require.ensure([], () => {
			cb(null, {
				content: require('./components/degub').default,
			})
		}, 'degub.components')
	},
}
