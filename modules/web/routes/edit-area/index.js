export default {
	path: 'areas(/:type)(/:name)(/:revision)',

	getComponents(location, cb) {
		require.ensure([], require => {
			cb(null, {
				content: require('../../modules/area-editor').default,
			})
		}, 'area-editor.components')
	},
}
