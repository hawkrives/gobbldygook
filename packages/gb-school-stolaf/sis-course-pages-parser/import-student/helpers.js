import parseHtml from '../parse-html'
import {status, text, classifyFetchErrors} from 'gb-lib'
import forOwn from 'lodash/forOwn'
import forEach from 'lodash/forEach'

const fetch = (url, args={}) => global.fetch(url, {cache: 'no-cache', credentials: 'same-origin', mode: 'same-origin', ...args}).catch(classifyFetchErrors)
export const fetchHtml = (...args) => fetch(...args).then(status).then(text).then(html)

export function html(text) {
	return parseHtml(text)
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
