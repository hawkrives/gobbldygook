import Bluebird from 'bluebird'
import {parseHtml} from '../parse-html'
import forOwn from 'lodash/forOwn'
import forEach from 'lodash/forEach'
import {v4 as uuid} from 'uuid'

export class ExtensionNotLoadedError extends Error {}
export class ExtensionTooOldError extends Error {}

export function fetchHtml(url, fetchArgs) {
	if (!global.gobbldygook_extension) {
		return Bluebird.reject(new ExtensionNotLoadedError('Extension not loaded'))
	}
	if (global.gobbldygook_extension < '1.0.0') {
		return Bluebird.reject(new ExtensionTooOldError(`Extension version ${global.gobbldygook_extension_version} is too old.`))
	}

	// now we know the extension is loaded
	return new Bluebird((resolve, reject) => {
		const id = uuid()

		function handleResponse(event) {
			// `event` should have the shape {from, id, text}
			if (event.data.from !== 'web-ext') {
				return
			}
			if (event.data.id !== id) {
				return
			}

			global.removeEventListener('message', handleResponse)

			if (event.data.error) {
				reject(event.data.error)
			}
			else {
				resolve(parseHtml(event.data.text))
			}
		}

		global.addEventListener('message', handleResponse)

		global.postMessage({
			from: 'page',
			id,
			url,
			fetchArgs,
		}, '*')
	})
}

export function buildFormData(obj) {
	let formData = new FormData()
	forOwn(obj, (val, key) => {
		formData.append(key, val)
	})
	return formData
}

export function getText(elems) {
	return getTextItems(elems).join('')
}

export function getTextItems(elems) {
	if (elems.children) {
		elems = elems.children
	}
	if (!elems) {
		return []
	}

	let ret = []

	forEach(elems, elem => {
		if (elem.type === 'text') {
			ret = ret.concat(elem.data.trim())
		}
		else if (elem.children && elem.type !== 'comment') {
			ret = ret.concat(getText(elem.children))
		}
	})

	return ret.filter(s => s.length)
}

export function removeInternalWhitespace(text) {
	return text.split(/\s+/).join(' ')
}
