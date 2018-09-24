// @flow

export default {
	path: 'areas(/:type)(/:name)(/:revision)',

	getComponents(location: mixed, cb: Function) {
		import(/* webpackChunkName: 'area-editor.components' */ '../../modules/area-editor').then(
			mod => cb(null, {content: mod.default}),
		)
	},
}
