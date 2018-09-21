// @flow

export default {
	path: 'areas(/:type)(/:name)(/:revision)',

	getComponents(location: mixed, cb: Function) {
		;(require: any).ensure(
			[],
			require => {
				cb(null, {
					content: require('../../modules/area-editor').default,
				})
			},
			'area-editor.components',
		)
	},
}
