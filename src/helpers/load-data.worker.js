import 'isomorphic-fetch'
import {status, json, text} from './fetch-helpers'
import stringifyError from './stringify-error'

import uniq from 'lodash/array/uniq'
import flatten from 'lodash/array/flatten'
import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import startsWith from 'lodash/string/startsWith'
import map from 'lodash/collection/map'
import present from 'present'
import yaml from 'js-yaml'

import db from './db'
import buildDept from '../helpers/build-dept'
import buildDeptNum from '../helpers/build-dept-num'
import splitParagraph from '../helpers/split-paragraph'
import {convertTimeStringsToOfferings} from 'sto-sis-time-parser'

const debug = console.log.bind(console)


function dispatch(type, action, ...args) {
	self.postMessage([null, 'dispatch', {type, action, args}])
}


function prepareCourse(course) {
	const nameWords = splitParagraph(course.name)
	const notesWords = splitParagraph(course.notes)
	const titleWords = splitParagraph(course.title)
	const descWords = splitParagraph(course.desc)

	return {
		name: course.name || course.title,
		dept: course.dept || buildDept(course),
		deptnum: course.deptnum || buildDeptNum(course),
		offerings: course.offerings || convertTimeStringsToOfferings(course),
		words: uniq([...nameWords, ...notesWords, ...titleWords, ...descWords]),
		profWords: uniq(flatten(map(course.instructors, splitParagraph))),
	}
}


function cacheItemHash(path, type, hash) {
	debug(`cacheItemHash(): ${path}`)

	return db.store(getCacheStoreName(type)).put({id: path, path, hash})
}


function getCacheStoreName(type) {
	if (type === 'courses') {
		return 'courseCache'
	}
	else if (type === 'areas') {
		return 'areaCache'
	}
	else {
		throw new TypeError(`needsUpdate(): "${type}" is not a valid store type`)
	}
}


function storeCourses(path, data) {
	debug(`storeCourses(): ${path}`)

	let coursesToStore = map(data, course => {
		course.sourcePath = path
		return {...course, ...prepareCourse(course)}
	})

	const start = present()
	return db.store('courses').batch(coursesToStore)
		.then(() => {
			debug(`Stored ${size(coursesToStore)} courses in ${present() - start}ms.`)
		})
		.catch(err => {
			const db = err.target.db.name
			const errorName = err.target.error.name

			if (errorName === 'QuotaExceededError') {
				dispatch('notifications', 'logError', {
					id: 'db-storage-quota-exceeded',
					message: `The database "${db}" has exceeded its storage quota.`,
				})
			}

			throw err
		})
}


function storeArea(path, data) {
	debug(`storeArea(): ${path}`)

	let area = {
		...data,
		type: data.type.toLowerCase(),
		sourcePath: path,
		dateAdded: new Date(),
	}

	return db.store('areas').put(area)
		.catch(err => {
			throw err
		})
}


async function cleanPriorData(path, type) {
	debug(`cleanPriorData(): ${path}`)

	let ops = []

	try {
		if (type === 'courses') {
			let oldItems = await db.store(type).index('sourcePath').get(path)
			ops = map(oldItems, item => ({ type: 'del', key: item.clbid }))
		}
		else if (type === 'areas') {
			let oldItems = await db.store(type).get(path)
			ops = map(oldItems, item => ({ type: 'del', key: item.sourcePath }))
		}
		else {
			throw new TypeError(`cleanPriorData(): "${type}" is not a valid store type`)
		}

		await db.store(type).batch(ops)
	}
	catch (err) {
		throw err
	}

	try {
		await db.store(getCacheStoreName(type)).del(path)
	}
	catch (err) {
		throw err
	}
}


const updateDatabase = (type, infoFileBase, notificationId) => async infoFromServer => {
	// Get the path to the current file and the hash of the file
	const {path, hash} = infoFromServer
	// Append the hash, to act as a sort of cache-busting mechanism
	const itemUrl = `/${path}?v=${hash}`

	debug(`updateDatabase(): ${path}`)

	const url = infoFileBase + itemUrl

	// go fetch the data!
	let rawData = undefined
	try {
		rawData = await (fetch(url).then(status).then(text))
	}
	catch (err) {
		console.warn('Could not fetch ${url}')
		return false
	}

	// now parse the data into a usable form
	let data
	if (type === 'courses') {
		data = JSON.parse(rawData)
	}
	else if (type === 'areas') {
		data = yaml.safeLoad(rawData)
		data.source = rawData
	}

	try {
		// clear out any old data
		await cleanPriorData(path, type)

		// store the new data
		if (type === 'courses') {
			await storeCourses(path, data)
		}
		else if (type === 'areas') {
			await storeArea(path, data)
		}

		// record that we stored the new data
		await cacheItemHash(path, type, hash)
	}
	catch (e) {
		throw e
	}

	debug(`added ${path}`)
	dispatch('notifications', 'incrementProgress', notificationId)
}


async function needsUpdate(type, path, hash) {
	const {hash: oldHash} = await db.store(getCacheStoreName(type)).get(path) || {}

	return hash !== oldHash
}


async function loadFiles(url, infoFileBase) {
	debug(`loadFiles(): ${url}`)

	let infoFile
	try {
		infoFile = await (fetch(url).then(status).then(json))
	}
	catch (err) {
		if (startsWith(err.message, 'Failed to fetch')) {
			console.warn(`loadFiles(): Failed to fetch ${url}`)
			return false
		}
		throw err
	}

	const type = infoFile.type
	const notificationId = type
	let filesToLoad = infoFile.files

	if (type === 'courses') {
		// Only get the last four years of data
		const oldestYear = new Date().getFullYear() - 4
		filesToLoad = filter(filesToLoad, file => file.year >= oldestYear)
	}

	// For each file, see if it needs loading.
	const filesThatNeedUpdate = map(filesToLoad, file => needsUpdate(type, file.path, file.hash))
	const fileNeedsLoading = await Promise.all(filesThatNeedUpdate)

	// Cross-reference each file to load with the list of files that need loading
	filesToLoad = filter(filesToLoad, (file, index) => fileNeedsLoading[index])

	// Exit early if nothing needs to happen
	if (filesToLoad.length === 0) {
		return true
	}

	// Fire off the progress bar
	dispatch('notifications', 'startProgress', notificationId, `Loading ${type}`, {max: size(filesToLoad)}, true)

	// Load them into the database
	try {
		const update = updateDatabase(type, infoFileBase, notificationId)
		await Promise.all(map(filesToLoad, update))
	}
	catch (err) {
		throw err
	}

	// Remove the progress bar after 1.5 seconds
	dispatch('notifications', 'removeNotification', notificationId, 1500)
	if (type === 'courses') {
		dispatch('courses', 'loadCourses')
	}
	else if (type === 'areas') {
		dispatch('areas', 'loadAreas')
	}

	return true
}

self.addEventListener('message', ({data}) => {
	const [id, ...args] = data
	debug('[load-data] received message:', args)

	loadFiles(...args)
		.then(result => self.postMessage([id, 'result', result]))
		.catch(err => self.postMessage([id, 'error', JSON.parse(stringifyError(err))]))
})
