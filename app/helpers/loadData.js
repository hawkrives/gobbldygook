import _ from 'lodash'
import Promise from 'bluebird'
import present from 'present'

import notificationActions from '../flux/notificationActions'
import {status, json} from './fetchHelpers'
import db from './db'

import {buildDept, buildDeptNum, splitParagraph} from 'sto-helpers'
import {convertTimeStringsToOfferings} from 'sto-sis-time-parser'

import {map, filter, size} from 'lodash'


let logDataLoading = false
// let logDataLoading = true

let log = (...args) => {if (logDataLoading) console.log(...args)}
let info = (...args) => {if (logDataLoading) console.info(...args)}
let error = (...args) => {if (logDataLoading) console.error(...args)}


function prepareCourse(course) {
	course.name = course.name || course.title
	course.dept = course.dept || buildDept(course)
	course.deptnum = course.deptnum || buildDeptNum(course)
	course.offerings = course.offerings || convertTimeStringsToOfferings(course)

	let nameWords = splitParagraph(course.name)
	let notesWords = splitParagraph(course.notes)
	let titleWords = splitParagraph(course.title)
	let descWords = splitParagraph(course.desc)
	let words = _.union(nameWords, notesWords, titleWords, descWords)
	course.words = words

	course.profWords = _.chain(course.instructors)
		.map(splitParagraph)
		.flatten()
		.value()

	return course
}


let startProgressNotification = _.curry((notificationId, itemType, count) => {
	notificationActions.startProgress(notificationId, `Loading ${itemType}`, {max: count}, true)
})

let updateProgressNotification = _.curry((notificationId) => {
	notificationActions.incrementProgress(notificationId)
})

let completeProgressNotification = _.curry((notificationId, time=1500) => {
	notificationActions.removeNotification(notificationId, time)
})

let logAdded = (item) => {
	log(`added ${item.path} (${item.count} ${item.type})`)
}


async function storeCourses(item) {
	console.log('storing courses')
	let start = present()

	let coursesToStore = map(item.data, (course) => {
		course.sourcePath = item.path
		return prepareCourse(course)
	})

	try {
		await db.store('courses').batch(coursesToStore)
	} catch(e) {
		throw e
	}

	console.log(`Stored ${size(coursesToStore)} courses in ${present() - start}ms.`)
	return item
}

async function storeArea(item) {
	console.log(item.path, 'called storeArea')

	let area = item.data.info
	area.sourcePath = item.path

	try {
		await db.store('areas').put(area)
	} catch(e) {
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

async function cleanPriorData(item) {
	let {type, path} = item
	console.info(`deleting ${type} from ${path}`)

	let items = []

	try {
		items = await db.store(type)
			.index('sourcePath')
			.get(path)
	}
	catch (e) {
		throw e
	}

	items = map(items, (item) => {
		let result = Object.create(null)
		result[item.clbid] = null
		return result
	})

	try {
		await db.store(item.type).batch(items)
	}
	catch (e) {
		throw e
	}

	localStorage.removeItem(path)
}

async function cacheItemHash(item) {
	console.info(`${item.path} called cacheItemHash`)
	localStorage.setItem(item.path, item.hash)
	return item
}

let lookup = {
	courses: 'courses',
	areas: 'info',
}

async function updateDatabase(type, infoFromServer, notificationId, count) {
	let {path, hash, year} = infoFromServer
	let oldHash = localStorage.getItem(path)

	let itemUrl = `./data/${type}/${path}?v=${hash}`

	if (hash === oldHash) {
		log('skipped ' + itemUrl)
		return false
	}

	startProgressNotification(notificationId, type, count)

	log(`need to add ${itemUrl}`)

	let data;
	try {
		data = await fetch(itemUrl)
			.then(status)
			.then(json)
	} catch (e) {
		throw e
	}

	let item = {count: size(data), data, path, hash, year, type}

	try {
		await cleanPriorData(item)
		await storeItem(item)
		await cacheItemHash(item)
	} catch (e) {
		throw e
	}

	logAdded(item)
	updateProgressNotification(notificationId)
}

async function loadDataFiles(infoFile) {
	console.log('load data files', infoFile)

	// Only get the last four years of data
	let oldestYear = new Date().getFullYear() - 4
	let lastFourYears = filter(infoFile.files, file => parseInt(file.year) >= oldestYear)

	let notificationId = infoFile.type

	// Load them into the database
	let filePromises = map(lastFourYears, (file) =>
		updateDatabase(infoFile.type, file, notificationId, size(lastFourYears)))

	await* filePromises

	completeProgressNotification(notificationId)
}

async function loadInfoFile(url) {
	console.log('loading ' + url)
	let infoFile = await fetch(url).then(status).then(json)
	loadDataFiles(infoFile)
}

async function loadData() {
	let infoFiles = [
		'./data/courses/info.json',
	]
	await* map(infoFiles, loadInfoFile)
}

export default loadData
