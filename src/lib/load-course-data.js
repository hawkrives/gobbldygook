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

import debug from 'debug'
let log = debug('gobbldygook:data')
debug.disable('gobbldygook:data')

import uniq from 'lodash/array/uniq'
import sortBy from 'lodash/collection/sortBy'
import flatten from 'lodash/array/flatten'

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

async function storeCourses(item) {
	log(`storeCourses(): ${item.path}`)

	let coursesToStore = map(item.data, course => {
		course.sourcePath = item.path
		return prepareCourse(course)
	})

	const start = present()
	try {
		await db.store('courses').batch(coursesToStore)
	}
	catch (e) {
		// const db = e.target.db.name
		// const errorName = e.target.error.name

		// if (errorName === 'QuotaExceededError') {
			// notificationActions.logError({
			// 	id: 'db-storage-quota-exceeded',
			// 	message: `The database "${db}" has exceeded its storage quota.`,
			// })
		// }

		console.error(e.target)
		throw e
	}
	log(`Stored ${size(coursesToStore)} courses in ${present() - start}ms.`)

	return item
}

async function storeArea(item) {
	log(`storeArea(): ${item.path}`)

	const id = item.path

	let area = {
		...item.data,
		sourcePath: id,
		type: item.data.type.toLowerCase(),
	}

	try {
		await db.store('areas').put(area)
	}
	catch (err) {
		console.error(err)
		throw err
	}

	return item
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
		await db.store(type).batch(oldItems)
	}
	catch (err) {
		throw err
	}

	localStorage.removeItem(path)
}

async function cacheItemHash(item) {
	log(`${item.path} called cacheItemHash`)
	localStorage.setItem(item.path, item.hash)
	return item
}

async function updateDatabase(type, infoFromServer, infoFileBase, notificationId, count) {
	const {path, hash} = infoFromServer
	const itemUrl = `/${path}?v=${hash}`

	if (hash === oldHash) {
		log(`skipped ${path}`)
		return true
	}

	log(`updateDatabase(): ${path}`)
	startProgress(notificationId, `Loading ${type}`, {max: count}, true)

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
	incrementProgress(notificationId)
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

	// Load them into the database
	await* map(filesToLoad, file =>
		updateDatabase(infoFile.type, file, infoFileBase, notificationId, size(filesToLoad))
			.catch(err => {
				throw err
			}))

	// notificationActions.removeNotification(notificationId, 1500)
}

async function loadInfoFile(url, infoFileBase) {
	log('loading ' + url)
	let infoFile
	try {
		infoFile = await fetch(url).then(status).then(json)
	}
	catch (err) {
		if (startsWith(err.message, 'Failed to fetch')) {
			console.error(`loadInfoFile(): Failed to fetch ${url}`)
			return false
		}
		else {
			throw err
		}
	}

	try {
		await loadDataFiles(infoFile, infoFileBase)
	}
	catch (err) {
		throw err
	}
}

export default async function loadData() {
	const cachebuster = Date.now()

	const infoFiles = [
		'./courseData.url',
		'./areaData.url',
	]

	const processedFiles = await* map(infoFiles,
		file => fetch(file)
			.then(status)
			.then(text)
			.then(path => path.trim())
			.catch(err => console.error(err)))

	try {
		await* map(processedFiles, path => loadInfoFile(`${path}/info.json?${cachebuster}`, path))
	}
	catch (err) {
		console.error(err)
		throw err
	}
}
