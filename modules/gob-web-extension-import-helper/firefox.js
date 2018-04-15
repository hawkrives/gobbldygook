/* global InstallTrigger:false */
const url = '/gobbldygook_sis_integration-1.0.0-fx+an.xpi'

export function installExtension() {
	if (typeof InstallTrigger === 'undefined') {
		return Promise.reject('The `InstallTrigger` global does not exist')
	}
	return new Promise(() => {
		InstallTrigger.install({
			Gobbldygook: {
				URL: url,
				toString: function() {
					return this.URL
				},
			},
		})
	})
}
