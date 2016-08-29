import Bluebird from 'bluebird'

import 'isomorphic-fetch'
import {status, json, text} from '../fetch-helpers'
import stringifyError from '../stringify-error'

import range from 'idb-range'
import uniq from 'lodash/uniq'
import forEach from 'lodash/forEach'
import flatMap from 'lodash/flatMap'
import filter from 'lodash/filter'
import size from 'lodash/size'
import startsWith from 'lodash/startsWith'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import fromPairs from 'lodash/fromPairs'
import some from 'lodash/some'
import round from 'lodash/round'
import present from 'present'
import yaml from 'js-yaml'

import db from '../db'
import buildDept from '../build-dept'
import buildDeptNum from '../build-dept-num'
import splitParagraph from '../split-paragraph'
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
		profWords: uniq(flatMap(course.instructors, splitParagraph)),
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
			debug(`Stored ${size(coursesToStore)} courses in ${round(present() - start, 2)}ms.`)
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
			// erase any old items from this sourcePath
			let oldItems = await db.store('courses').index('sourcePath').getAll(range({ eq: path }))
			ops = fromPairs(map(oldItems, item => ([item.clbid, null])))
		}
		else if (type === 'areas') {
			// erase any old items with this path
			let oldItems = await db.store('areas').getAll(range({ eq: path }))
			ops = fromPairs(map(oldItems, item => ([item.sourcePath, null])))
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


const updateDatabase = async (type, infoFileBase, notificationId, infoFromServer) => {
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


async function removeDuplicateAreas() {
	let allAreas
	try {
		allAreas = await db.store('areas').getAll()
	}
	catch (err) {
		throw err
	}

	// now de-duplicate, based on name, type, and revision
	// reasons for duplicates:
	// - a major adds a new revision
	// 		- the old one will have already been replaced by the new one, because of cleanPriorData
	// - a major … are there any other cases?

	const grouped = groupBy(allAreas, area => `{${area.name}, ${area.type}, ${area.revision}}`)
	const withDuplicates = filter(grouped, list => list.length > 1)

	let ops = {}
	forEach(withDuplicates, duplicatesList => {
		duplicatesList = sortBy(duplicatesList, area => area.sourcePath.length)
		duplicatesList.shift() // take off the shortest one
		ops = {...ops, ...fromPairs(map(duplicatesList, item => ([item.sourcePath, null])))}
	})

	// remove any that are invalid
	// --- something about any values that aren't objects

	const invalidAreas = filter(allAreas, area => some(['name', 'revision', 'type'], key => area[key] === undefined))
	ops = {...ops, ...fromPairs(map(invalidAreas, item => ([item.sourcePath, null])))}

	try {
		await db.store('areas').batch(ops)
	}
	catch (err) {
		throw err
	}
}


async function loadFiles(url, infoFileBase) {
	debug(`loadFiles(): ${url}`)

	let infoFile
	try {
		infoFile = await fetch(url).then(status).then(json)
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
	const fileNeedsLoading = await Bluebird.map(filesToLoad, file => needsUpdate(type, file.path, file.hash))

	// Cross-reference each file to load with the list of files that need loading
	filesToLoad = filter(filesToLoad, (file, index) => fileNeedsLoading[index])

	// Exit early if nothing needs to happen
	if (filesToLoad.length === 0) {
		return true
	}

	// Fire off the progress bar
	dispatch('notifications', 'startProgress', notificationId, `Loading ${type}`, {max: size(filesToLoad), showButton: true})

	// Load them into the database
	try {
		await Bluebird.map(
			filesToLoad,
			file => updateDatabase(type, infoFileBase, notificationId, file),
			{concurrency: 2})
	}
	catch (err) {
		throw err
	}

	// Clean up the database a bit
	try {
		if (type === 'areas') {
			removeDuplicateAreas()
		}
	}
	catch (err) {
		throw err
	}

	// Remove the progress bar after 1.5 seconds
	dispatch('notifications', 'removeNotification', notificationId, 1500)
	if (type === 'courses') {
		dispatch('courses', 'refreshCourses')
	}
	else if (type === 'areas') {
		dispatch('areas', 'refreshAreas')
	}

	return true
}

function checkIdbInWorkerSupport() {
	if (self.IDBCursor) {
		return Promise.resolve(true)
	}
	return Promise.resolve(false)
}

const CHECK_IDB_IN_WORKER_SUPPORT = '__check-idb-worker-support'
self.addEventListener('message', async ({data}) => {
	const [id, ...args] = data
	debug('[load-data] received message:', args)

	if (id === CHECK_IDB_IN_WORKER_SUPPORT) {
		try {
			let result = await checkIdbInWorkerSupport()
			self.postMessage([id, 'result', result])
		}
		catch (err) {
			self.postMessage([id, 'error', JSON.parse(stringifyError(err))])
		}
		return
	}

	try {
		let result = await loadFiles(...args)
		self.postMessage([id, 'result', result])
	}
	catch (err) {
		self.postMessage([id, 'error', JSON.parse(stringifyError(err))])
	}
})
