import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import startsWith from 'lodash/string/startsWith'
import present from 'present'
import yaml from 'js-yaml'

import {status, json, text} from './fetch-helpers'
import db from './db'

import buildDept from '../helpers/build-dept'
import buildDeptNum from '../helpers/build-dept-num'
import splitParagraph from '../helpers/split-paragraph'
import {convertTimeStringsToOfferings} from 'sto-sis-time-parser'
import {
	logError,
	startProgress,
	incrementProgress,
	removeNotification,
} from '../ducks/notifications'
import {refreshData} from '../flux/student-actions'

import debug from 'debug'
let log = debug('gobbldygook:data')
debug.disable('gobbldygook:data')

import uniq from 'lodash/array/uniq'
import sortBy from 'lodash/collection/sortBy'
import flatten from 'lodash/array/flatten'

function dispatch(action) {
	typeof window !== 'undefined' && window.dispatch && window.dispatch(action)
}

function prepareCourse(course) {
	course.name = course.name || course.title
	course.dept = course.dept || buildDept(course)
	course.deptnum = course.deptnum || buildDeptNum(course)
	course.offerings = course.offerings || convertTimeStringsToOfferings(course)

	const nameWords = splitParagraph(course.name)
	const notesWords = splitParagraph(course.notes)
	const titleWords = splitParagraph(course.title)
	const descWords = splitParagraph(course.desc)

	course.words = uniq(sortBy([...nameWords, ...notesWords, ...titleWords, ...descWords]), true)
	course.profWords = uniq(sortBy(flatten(map(course.instructors, splitParagraph))), true)

	return course
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

function storeCourses(item) {
	log(`storeCourses(): ${item.path}`)

	let coursesToStore = map(item.data, course => {
		course.sourcePath = item.path
		return prepareCourse(course)
	})

	const start = present()
	return db.store('courses').batch(coursesToStore)
		.then(() => {
			log(`Stored ${size(coursesToStore)} courses in ${present() - start}ms.`)
		})
		.catch(err => {
			const db = err.target.db.name
			const errorName = err.target.error.name

			if (errorName === 'QuotaExceededError') {
				dispatch(logError({
					id: 'db-storage-quota-exceeded',
					message: `The database "${db}" has exceeded its storage quota.`,
				}))
			}

			console.error(err)
			throw err

		})
}

function storeArea(item) {
	log(`storeArea(): ${item.path}`)

	const id = item.path

	let area = {
		...item.data,
		sourcePath: id,
		type: item.data.type.toLowerCase(),
	}

	return db.store('areas').put(area)
		.catch(err => {
			console.error(err)
			throw err
		})
}

function storeItem(item) {
	if (item.type === 'courses') {
		return storeCourses(item)
	}
	else if (item.type === 'areas') {
		return storeArea(item)
	}
}

async function cleanPriorData({path, type}) {
	log(`cleanPriorData(): ${path}`)

	let oldItems = []

	try {
		if (type === 'courses') {
			oldItems = await db.store(type).index('sourcePath').get(path)
			oldItems = map(oldItems, item => ({ [item.clbid]: null }))
		}
		else if (type === 'areas') {
			oldItems = await db.store(type).get(path)
			oldItems = map(oldItems, item => ({ [item.sourcePath]: null }))
		}
		else {
			throw new TypeError(`needsUpdate(): "${type}" is not a valid store type`)
		}

		await db.store(type).batch(oldItems)
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

function cacheItemHash({path, type, hash}) {
	log(`cacheItemHash(): ${path}`)

	return db.store(getCacheStoreName(type)).put({id: path, path, hash})
}

async function updateDatabase(type, infoFromServer, infoFileBase, notificationId, count) {
	const {path, hash} = infoFromServer
	const itemUrl = `/${path}?v=${hash}`

	log(`updateDatabase(): ${path}`)
	dispatch(startProgress(notificationId, `Loading ${type}`, {max: count}, true))

	const url = infoFileBase + itemUrl
	let data = undefined
	try {
		data = await fetch(url)
			.then(status)
			.then(text)
	}
	catch (err) {
		console.error('Could not fetch ${url}')
		return false
	}

	if (type === 'courses') {
		data = JSON.parse(data)
	}
	else if (type === 'areas') {
		data = {...yaml.safeLoad(data), source: data}
	}

	const item = {
		...infoFromServer,
		path,
		hash,
		data,
		type,
		count: size(data),
	}

	try {
		await cleanPriorData(item)
		await storeItem(item)
		await cacheItemHash(item)
	}
	catch (e) {
		throw e
	}

	log(`added ${item.path} (${item.count} ${item.type})`)
	dispatch(incrementProgress(notificationId))
}

async function needsUpdate({type, path, hash}) {
	const {hash: oldHash} = await db.store(getCacheStoreName(type)).get(path) || {}

	return hash !== oldHash
}

async function loadDataFiles(infoFile, infoFileBase) {
	log(`loadDataFiles(): ${infoFileBase}`)

	const notificationId = infoFile.type
	let filesToLoad = infoFile.files

	if (infoFile.type === 'courses') {
		// Only get the last four years of data
		const oldestYear = new Date().getFullYear() - 4
		filesToLoad = filter(filesToLoad, file => file.year >= oldestYear)
	}

	const fileNeedsLoading = await* map(filesToLoad, file => needsUpdate({type: infoFile.type, path: file.path, hash: file.hash}))
	filesToLoad = filter(filesToLoad, (file, index) => fileNeedsLoading[index])

	// Load them into the database
	try {
		await* map(filesToLoad, file => updateDatabase(infoFile.type, file, infoFileBase, notificationId, size(filesToLoad)))
	}
	catch (err) {
		throw err
	}

	dispatch(removeNotification(notificationId, {delay: 1500}))

	return infoFile
}

function loadInfoFile(url, infoFileBase) {
	log(`loadInfoFile(): ${url}`)

	return fetch(url)
		.then(status)
		.then(json)
		.then(infoFile => loadDataFiles(infoFile, infoFileBase))
		.then(infoFile => {
			refreshData({[infoFile.type]: true})
		})
		.catch(err => {
			if (startsWith(err.message, 'Failed to fetch')) {
				console.error(`loadInfoFile(): Failed to fetch ${url}`)
				return false
			}
			else {
				throw err
			}
		})
}

export default function loadData() {
	const cachebuster = Date.now()

	const infoFiles = [
		'./courseData.url',
		'./areaData.url',
	]

	const promises = map(infoFiles,
		file => fetch(file)
			.then(status)
			.then(text)
			.then(path => path.trim())
			.then(path => {
				return loadInfoFile(`${path}/info.json?${cachebuster}`, path)
			})
			.catch(err => {
				throw err
			}))

	return Promise.all(promises)
}
