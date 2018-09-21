// @flow

export default {
	path: 'degub',
	getComponents(state: mixed, cb: Function) {
		(require: any).ensure(
			[],
			() => {
				cb(null, {
					content: require('./degub').default,
				})
			},
			'degub.components',
		)
	},
}
