import 'whatwg-fetch'
import {status, json, text} from 'modules/lib/fetch-helpers'

import startsWith from 'lodash/startsWith'
import yaml from 'js-yaml'

import Promise from 'bluebird'
import fsCallbacks from 'graceful-fs'
const fs = Promise.promisifyAll(fsCallbacks)

export function loadFile(pathOrUrl) {
	return startsWith(pathOrUrl, 'http')
		? fetch(pathOrUrl).then(status).then(text)
		: fs.readFileAsync(pathOrUrl, {encoding: 'utf-8'})
}

export function loadJsonFile(pathOrUrl) {
	return startsWith(pathOrUrl, 'http')
		? fetch(pathOrUrl).then(status).then(json)
		: fs.readFileAsync(pathOrUrl, {encoding: 'utf-8'}).then(JSON.parse)
}

export function loadYamlFile(pathOrUrl) {
	return startsWith(pathOrUrl, 'http')
		? fetch(pathOrUrl).then(status).then(text).then(yaml.safeLoad)
		: fs.readFileAsync(pathOrUrl, {encoding: 'utf-8'}).then(yaml.safeLoad)
}

export function tryReadFile(path) {
	try {
		return fs.readFileSync(path, {encoding: 'utf-8'})
	} catch (err) {} // eslint-disable-line brace-style, no-empty

	return false
}

export function tryReadJsonFile(path) {
	try {
		return JSON.parse(fs.readFileSync(path, {encoding: 'utf-8'}))
	} catch (err) {} // eslint-disable-line brace-style, no-empty

	return false
}
