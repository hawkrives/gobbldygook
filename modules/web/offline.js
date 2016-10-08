import runtime from 'offline-plugin/runtime'
import debug from 'debug'
const log = debug('web:offline')

runtime.install({
	onUpdating() {
		log('SW Event:', 'onUpdating')
	},

	onUpdateReady() {
		log('SW Event:', 'onUpdateReady')
		// Tells the new SW to take control immediately
		runtime.applyUpdate()
	},

	onUpdated() {
		log('SW Event:', 'onUpdated')
		// Reload the webpage to load into the new version
		window.location.reload()
	},

	onUpdateFailed() {
		log('SW Event:', 'onUpdateFailed')
	},
})
