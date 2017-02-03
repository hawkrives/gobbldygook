import 'whatwg-fetch'
import { status, json, text } from '../../lib/fetch-helpers'
import serializeError from 'serialize-error'
import series from 'p-series'

import range from 'idb-range'
import filter from 'lodash/filter'
import flatMap from 'lodash/flatMap'
import forEach from 'lodash/forEach'
import fromPairs from 'lodash/fromPairs'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import round from 'lodash/round'
import size from 'lodash/size'
import some from 'lodash/some'
import sortBy from 'lodash/sortBy'
import startsWith from 'lodash/startsWith'
import uniq from 'lodash/uniq'
import present from 'present'
import yaml from 'js-yaml'

import db from './db'
import { buildDeptString, buildDeptNum } from '../../school-st-olaf-college/deptnums'
import { splitParagraph } from '../../lib/split-paragraph'
import { convertTimeStringsToOfferings } from 'sto-sis-time-parser'

const log = (...args) => args.length && console.log('worker:load-data', ...args)


function dispatch(type, action, ...args) {
	self.postMessage([null, 'dispatch', { type, action, args }])
}

const fetchText = (...args) => fetch(...args).then(status).then(text)
const fetchJson = (...args) => fetch(...args).then(status).then(json)


function prepareCourse(course) {
	const nameWords = splitParagraph(course.name)
	const notesWords = splitParagraph(course.notes)
	const titleWords = splitParagraph(course.title)
	const descWords = splitParagraph(course.desc)

	return {
		name: course.name || course.title,
		dept: course.dept || buildDeptString(course.departments),
		deptnum: course.deptnum || buildDeptNum(course),
		offerings: course.offerings || convertTimeStringsToOfferings(course),
		words: uniq([...nameWords, ...notesWords, ...titleWords, ...descWords]),
		profWords: uniq(flatMap(course.instructors, splitParagraph)),
	}
}


function cacheItemHash(path, type, hash) {
	log(`cacheItemHash(): ${path}`)

	return db.store(getCacheStoreName(type)).put({ id: path, path, hash })
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
	log(`storeCourses(): ${path}`)

	let coursesToStore = map(data, course => ({
		...course,
		...prepareCourse(course),
		sourcePath: path,
	}))

	const start = present()
	return db.store('courses').batch(coursesToStore)
		.then(() => {
			log(`Stored ${size(coursesToStore)} courses in ${round(present() - start, 2)}ms.`)
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
	log(`storeArea(): ${path}`)

	let area = {
		...data,
		type: data.type.toLowerCase(),
		sourcePath: path,
		dateAdded: new Date(),
	}

	return db.store('areas').put(area).catch(err => {
		throw err
	})
}


function cleanPriorCourses(path) {
	return db.store('courses').index('sourcePath').getAll(range({ eq: path }))
		.then(oldItems => fromPairs(map(oldItems, item => ([item.clbid, null]))))
}

function cleanPriorAreas(path) {
	return db.store('areas').getAll(range({ eq: path }))
		.then(oldItems => fromPairs(map(oldItems, item => ([item.sourcePath, null]))))
}

function cleanPriorData(path, type) {
	log(`cleanPriorData(): ${path}`)

	let ps
	if (type === 'courses') {
		ps = cleanPriorCourses(path)
	}
	else if (type === 'areas') {
		ps = cleanPriorAreas(path)
	}
	else {
		throw new TypeError(`cleanPriorData(): "${type}" is not a valid store type`)
	}

	return ps.then(ops => series([
		db.store(type).batch(ops),
		db.store(getCacheStoreName(type)).del(path),
	])).catch(err => {
		throw err
	})
}

function storeData(path, type, data) {
	// store the new data
	if (type === 'courses') {
		return storeCourses(path, data)
	}
	else if (type === 'areas') {
		return storeArea(path, data)
	}
}

function parseData(raw, type) {
	if (type === 'courses') {
		return JSON.parse(raw)
	}
	else if (type === 'areas') {
		let data = yaml.safeLoad(raw)
		data.source = raw
		return data
	}
	return {}
}

function updateDatabase(type, infoFileBase, notificationId, infoFromServer) {
	// Get the path to the current file and the hash of the file
	const { path, hash } = infoFromServer
	// Append the hash, to act as a sort of cache-busting mechanism
	const itemUrl = `/${path}?v=${hash}`

	log(`updateDatabase(): ${path}`)

	const url = infoFileBase + itemUrl

	// go fetch the data!
	return fetchText(url).then(rawData => {
		// now parse the data into a usable form
		const data = parseData(rawData, type)

		return series([
			// clear out any old data
			() => cleanPriorData(path, type),
			// store the new data
			() => storeData(path, type, data),
			// record that we stored the new data
			() => cacheItemHash(path, type, hash),
		])
	}, () => {
		log(`Could not fetch ${url}`)
		return false
	}).then(() => {
		log(`added ${path}`)
		dispatch('notifications', 'incrementProgress', notificationId)
	})
}


function needsUpdate(type, path, hash) {
	return db.store(getCacheStoreName(type)).get(path)
		.then(dbresult => {
			return dbresult ? dbresult.hash !== hash : true
		})
}


function removeDuplicateAreas() {
	return db.store('areas').getAll().then(allAreas => {
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
			ops = { ...ops, ...fromPairs(map(duplicatesList, item => ([item.sourcePath, null]))) }
		})

		// remove any that are invalid
		// --- something about any values that aren't objects

		const invalidAreas = filter(allAreas, area => some(['name', 'revision', 'type'], key => area[key] === undefined))
		ops = { ...ops, ...fromPairs(map(invalidAreas, item => ([item.sourcePath, null]))) }

		return db.store('areas').batch(ops)
	})
}


function loadFiles(url, infoFileBase) {
	log(`loadFiles(): ${url}`)

	// bad hawken?
	let type
	let notificationId
	let filesToLoad

	return fetchJson(url).then(infoFile => {
		type = infoFile.type
		notificationId = type
		filesToLoad = infoFile.files

		if (type === 'courses') {
			// only download the json courses
			filesToLoad = filesToLoad.filter(file => file.type === 'json')
			// Only get the last four years of data
			const oldestYear = new Date().getFullYear() - 5
			filesToLoad = filter(filesToLoad, file => file.year >= oldestYear)
		}

		// For each file, see if it needs loading.
		return Promise.all(filesToLoad.map(file => needsUpdate(type, file.path, file.hash)))
	}, err => {
		if (startsWith(err.message, 'Failed to fetch')) {
			log(`loadFiles(): Failed to fetch ${url}`)
			return []
		}
		throw err
	})
	.then(filesNeedLoading => {
		// Cross-reference each file to load with the list of files that need loading
		filesToLoad = filter(filesToLoad, (file, index) => filesNeedLoading[index])

		// Exit early if nothing needs to happen
		if (filesToLoad.length === 0) {
			log(`[${type}] no files need loading`)
			return true
		}

		log(`[${type}] these files need loading:`, ...filesNeedLoading)

		// Fire off the progress bar
		dispatch('notifications', 'startProgress', notificationId, `Loading ${type}`, { max: size(filesToLoad), showButton: true })

		// Load them into the database
		return series(filesToLoad.map(file => {
			return () => updateDatabase(type, infoFileBase, notificationId, file)
		}))
	})
	.then(() => {
		// Clean up the database a bit
		if (type === 'areas') {
			return removeDuplicateAreas()
		}
	}, err => {
		throw err
	})
	.then(() => {
		log(`[${type}] done loading`)

		// Remove the progress bar after 1.5 seconds
		dispatch('notifications', 'removeNotification', notificationId, 1500)
		if (type === 'courses') {
			dispatch('courses', 'refreshCourses')
		}
		else if (type === 'areas') {
			dispatch('areas', 'refreshAreas')
		}

		return true
	})
}

function checkIdbInWorkerSupport() {
	if (self.IDBCursor) {
		return Promise.resolve(true)
	}
	return Promise.resolve(false)
}

const CHECK_IDB_IN_WORKER_SUPPORT = '__check-idb-worker-support'
self.addEventListener('message', ({ data }) => {
	const [id, ...args] = data
	log('[load-data] received message:', ...args)

	if (id === CHECK_IDB_IN_WORKER_SUPPORT) {
		checkIdbInWorkerSupport()
			.then(result => self.postMessage([id, 'result', result]))
			.catch(err => self.postMessage([id, 'error', serializeError(err)]))
		return
	}

	loadFiles(...args)
		.then(result => self.postMessage([id, 'result', result]))
		.catch(err => self.postMessage([id, 'error', serializeError(err)]))
})
