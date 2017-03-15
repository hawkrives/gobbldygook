/* global InstallTrigger:false */
const url = '/gobbldygook/gobbldygook_sis_integration-1.0.0-fx+an.xpi'

export function installFirefoxExtension() {
    if (typeof InstallTrigger === 'undefined') {
        return Promise.reject('The `InstallTrigger` global does not exist')
    }
    return new Promise(resolve => {
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
