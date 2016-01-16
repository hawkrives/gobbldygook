export default {
	path: 'edit-area(/:type)(/:name)(/:revision)',

	getComponents(location, cb) {
		require.ensure([], require => {
			cb(null, {
				content: require('./containers/area-editor').default,
			})
		})
	},

	onEnter() {
		console.log('routes/area-editor', arguments)
	},
}
