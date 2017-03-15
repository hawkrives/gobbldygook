'use strict'
const { parseHtml } = require('../parse-html')
const forOwn = require('lodash/forOwn')
const forEach = require('lodash/forEach')
const uuid = require('uuid/v4')

class ExtensionNotLoadedError extends Error {}
class ExtensionTooOldError extends Error {}
module.exports.ExtensionNotLoadedError = ExtensionNotLoadedError
module.exports.ExtensionTooOldError = ExtensionTooOldError

module.exports.fetchHtml = fetchHtml
function fetchHtml(url, fetchArgs, fetchBody) {
    if (!global.gobbldygook_extension) {
        return Promise.reject(new ExtensionNotLoadedError('Extension not loaded'))
    }
    if (global.gobbldygook_extension < '1.0.0') {
        return Promise.reject(new ExtensionTooOldError(`Extension version ${global.gobbldygook_extension_version} is too old.`))
    }

	// now we know the extension is loaded
    return new Promise((resolve, reject) => {
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
            fetchBody,
        }, '*')
    })
}

module.exports.buildFormData = buildFormData
function buildFormData(obj) {
    let formData = new FormData()
    forOwn(obj, (val, key) => {
        formData.append(key, val)
    })
    return formData
}

module.exports.getText = getText
function getText(elems) {
    return getTextItems(elems).join('')
}

module.exports.getTextItems = getTextItems
function getTextItems(elems) {
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

module.exports.removeInternalWhitespace = removeInternalWhitespace
function removeInternalWhitespace(text) {
    return text.split(/\s+/).join(' ')
}
