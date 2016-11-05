/* global InstallTrigger:false */
import Bluebird from 'bluebird'
const url = '/gobbldygook/gobbldygook_sis_integration-1.0.0-fx+an.xpi'

export function installFirefoxExtension() {
	if (typeof InstallTrigger === 'undefined')  {
		return Bluebird.reject('The `InstallTrigger` global does not exist')
	}
	return new Bluebird((resolve, reject) => {
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
