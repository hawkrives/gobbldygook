// Originally from https://github.com/termi/Element.details

// HTMLElement.prototype.insertAdjacentHTML = https://gist.github.com/1276030

(function(global) {
	// Chrome 10 will fail this detection, but Chrome 10 no longer exists
	let support = 'open' in document.createElement('details')

	if (!support) {
		// style
		document.head.insertAdjacentHTML('beforeend', '<br><style>' + // <br> need for all IE
			'details{display:block}' +
			'details>*{display:none}' +
			'details>summary,details>summary,details>.▼▼{display:block}' +
			'details .details-marker:before{content:"►"}' +
			'details.▼ .details-marker:before{content:"▼"}' +
			'details.▼>*{display:block}' +
		'</style>')

		// property 'open'
		let openProperty = {
			'get': function() {
				if (!('nodeName' in this) || this.nodeName.toUpperCase() != 'DETAILS')
					return void 0

				return this.hasAttribute('open')
			},
			'set': function(booleanValue) {
				if (!('nodeName' in this) || this.nodeName.toUpperCase() != 'DETAILS')
					return void 0

				detailsShim(this)

				this.classList[booleanValue ? 'add' : 'remove']('▼')(this[booleanValue ? 'setAttribute' : 'removeAttribute'])('open', 'open')

				return booleanValue
			},
		}

		// event
		let eventDetailClick = function(e) {
			if (e.detail === 0) // Opera generate 'click' event with `detail` == 0 together with 'keyup' event
				return

			// 32 - space. Need this ???
			// 13 - Enter.

			if (e.keyCode === 13 || /*e.type == 'keyup'*/ e.type === 'click') {
				this.parentNode.open = !this.parentNode.open
			}
		}

		// details shim
		let detailsShim = function(details) {
			if (details._ && details._.__isShimmed) {
				return
			}

			if (!details._) {
				details._ = {}
			}

			// Wrap text node's and found `summary`
			let summary = undefined
			let j = -1
			let child = undefined
			while (child = details.childNodes[++j]) {
				if (child.nodeType === 3 && /[^\t\n\r ]/.test(child.data)) {
					details.insertBefore(
						document.createElement('x-i'), // Create a fake inline element
						child).innerHTML = child.data

					details.removeChild(child)
				}
				else if (child.nodeName.toUpperCase() == 'SUMMARY') {
					summary = child
				}
			}

			// Create a fake 'summary' element
			if (!summary) {
				(summary = document.createElement('x-s')).innerHTML = 'Details',
				summary.className = '▼▼' // http://css-tricks.com/unicode-class-names/
			}

			// Put summary as a first child
			details.insertBefore(summary, details.childNodes[0])
			// Create `details-marker` and put it as a summary first child
			summary.insertBefore(document.createElement('x-i'), summary.childNodes[0])
				.className = 'details-marker'

			// For access from keyboard
			summary.tabIndex = 0

			// events
			summary.addEventListener('click', eventDetailClick, false)
			summary.addEventListener('keyup', eventDetailClick, false)

			// flag to avoid double shim
			details._.__isShimmed = true
		}

		// init
		let init = function(global) {
			// property 'open'
			Object.defineProperty(global.Element.prototype, 'open', openProperty)

			var detailses = document.getElementsByTagName('details')

			let details = undefined
			while (details = detailses[++i]) {
				// DOM API
				details.open = details.hasAttribute('open')
			}
		}

		// auto init
		if (document.readyState != 'complete')
			document.addEventListener('DOMContentLoaded', init, false)
		else
			init()
	}
	// else {
		// TODO: for animation and other stuff we need to listen 'open'
		// property change and add 'open' css class for <details> element
	// }
})(window)
