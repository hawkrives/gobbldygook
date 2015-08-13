import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import curry from 'lodash/function/curry'
import present from 'present'
import yaml from 'js-yaml'

import notificationActions from '../flux/notification-actions'
import {status, json, text} from './fetch-helpers'
import db from './db'

import {buildDept, buildDeptNum, splitParagraph} from 'sto-helpers'
import {convertTimeStringsToOfferings} from 'sto-sis-time-parser'

import debug from 'debug'
let log = debug('gobbldygook:data')
debug.disable('gobbldygook:data')

import union from 'lodash/array/union'
import flatten from 'lodash/array/flatten'

function prepareCourse(course) {
	course.name = course.name || course.title
	course.dept = course.dept || buildDept(course)
	course.deptnum = course.deptnum || buildDeptNum(course)
	course.offerings = course.offerings || convertTimeStringsToOfferings(course)

	let nameWords = splitParagraph(course.name)
	let notesWords = splitParagraph(course.notes)
	let titleWords = splitParagraph(course.title)
	let descWords = splitParagraph(course.desc)
	let words = union(nameWords, notesWords, titleWords, descWords)
	course.words = words

	course.profWords = flatten(map(course.instructors, splitParagraph))

	return course
}


let startProgressNotification = curry((notificationId, itemType, count) => {
	notificationActions.startProgress(notificationId, `Loading ${itemType}`, {max: count}, true)
})

let updateProgressNotification = curry(notificationId => {
	notificationActions.incrementProgress(notificationId)
})

let completeProgressNotification = curry((notificationId, time=1500) => {
	notificationActions.removeNotification(notificationId, time)
})

function logAdded(item) {
	log(`added ${item.path} (${item.count} ${item.type})`)
}


async function storeCourses(item) {
	log('storing courses')
	const start = present()

	let coursesToStore = map(item.data, course => {
		course.sourcePath = item.path
		return prepareCourse(course)
	})

	try {
		await db.store('courses').batch(coursesToStore)
	}
	catch (e) {
		const db = e.target.db.name
		const errorName = e.target.error.name

		if (errorName === 'QuotaExceededError') {
			notificationActions.logError({
				id: 'db-storage-quota-exceeded',
				message: `The database "${db}" has exceeded its storage quota.`,
			})
		}

		console.error(e.target)
		throw e
	}

	log(`Stored ${size(coursesToStore)} courses in ${present() - start}ms.`)
	return item
}

async function storeArea(item) {
	log(item.path, 'called storeArea')

	let area = item.data
	area.sourcePath = item.path
	area.type = area.type.toLowerCase()

	try {
		await db.store('areas').put(area)
	}
	catch(e) {
		throw e
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
	log(`deleting ${type} from ${path}`)

	let oldItems = []

	try {
		oldItems = await db.store(type)
			.index('sourcePath')
			.get(path)
	}
	catch (e) {
		throw e
	}

	oldItems = map(oldItems, item => (
		{[item.clbid || item.sourcePath]: null}
	))

	try {
		await db.store(type).batch(oldItems)
	}
	catch (e) {
		throw e
	}

	localStorage.removeItem(path)
}

async function cacheItemHash(item) {
	log(`${item.path} called cacheItemHash`)
	localStorage.setItem(item.path, item.hash)
	return item
}

async function updateDatabase(type, infoFromServer, infoFileBase, notificationId, count) {
	let {path, hash} = infoFromServer
	let oldHash = localStorage.getItem(path)

	let itemUrl = `/${path}?v=${hash}`

	if (hash === oldHash) {
		log('skipped ' + itemUrl)
		return false
	}

	startProgressNotification(notificationId, type, count)

	log(`need to add ${itemUrl}`)

	let data = undefined
	try {
		data = await fetch(infoFileBase + itemUrl)
			.then(status)
			.then(text)
	}
	catch (e) {
		throw e
	}

	try {
		data = JSON.parse(data)
	}
	catch(e) {
		data = yaml.safeLoad(data)
	}

	let item = {
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

	logAdded(item)
	updateProgressNotification(notificationId)
}

async function loadDataFiles(infoFile, infoFileBase) {
	log('load data files', infoFile)

	let notificationId = infoFile.type
	let filesToLoad = infoFile.files

	if (infoFile.type === 'courses') {
		// Only get the last four years of data
		const oldestYear = new Date().getFullYear() - 4
		filesToLoad = filter(filesToLoad, file => file.year >= oldestYear)
	}

	// Load them into the database
	let filePromises = map(filesToLoad, file =>
		updateDatabase(infoFile.type, file, infoFileBase, notificationId, size(filesToLoad)))

	await* filePromises

	completeProgressNotification(notificationId)
}

async function loadInfoFile(url, infoFileBase) {
	log('loading ' + url)
	let data
	try {
		data = await fetch(url).then(status).then(json)
	}
	catch (err) {
		if (err.message.startsWith('Failed to fetch')) {
			console.error(`loadInfoFile(): Failed to fetch ${url}`)
			return false
		}
		else {
			throw err
		}
	}
	loadDataFiles(data, infoFileBase)
}

async function loadData() {
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

	await* map(processedFiles, path => loadInfoFile(`${path}/info.json?${cachebuster}`, path))
}

export default loadData
