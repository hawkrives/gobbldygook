import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import curry from 'lodash/function/curry'
import present from 'present'

import notificationActions from '../flux/notificationActions'
import {status, json} from './fetchHelpers'
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

let updateProgressNotification = curry((notificationId) => {
	notificationActions.incrementProgress(notificationId)
})

let completeProgressNotification = curry((notificationId, time=1500) => {
	notificationActions.removeNotification(notificationId, time)
})

let logAdded = (item) => {
	log(`added ${item.path} (${item.count} ${item.type})`)
}


async function storeCourses(item) {
	log('storing courses')
	const start = present()

	let coursesToStore = map(item.data, (course) => {
		course.sourcePath = item.path
		return prepareCourse(course)
	})

	try {
		await db.store('courses').batch(coursesToStore)
	}
	catch (e) {
		throw e
	}

	log(`Stored ${size(coursesToStore)} courses in ${present() - start}ms.`)
	return item
}

async function storeArea(item) {
	log(item.path, 'called storeArea')

	let area = item.data.info
	area.sourcePath = item.path

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

async function cleanPriorData(item) {
	let {type, path} = item
	log(`deleting ${type} from ${path}`)

	let oldCourses = []

	try {
		oldCourses = await db.store(type)
			.index('sourcePath')
			.get(path)
	}
	catch (e) {
		throw e
	}

	oldCourses = map(oldCourses, ({clbid}) => {
		let result = Object.create(null)
		result[clbid] = null
		return result
	})

	try {
		await db.store(item.type).batch(oldCourses)
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
	let {path, hash, year} = infoFromServer
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
			.then(json)
	}
	catch (e) {
		throw e
	}

	let item = {count: size(data), data, path, hash, year, type}

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

	// Only get the last four years of data
	let oldestYear = new Date().getFullYear() - 4
	let lastFourYears = filter(infoFile.files, (file) => parseInt(file.year) >= oldestYear)

	let notificationId = infoFile.type

	// Load them into the database
	let filePromises = map(lastFourYears, (file) =>
		updateDatabase(infoFile.type, file, infoFileBase, notificationId, size(lastFourYears)))

	await* filePromises

	completeProgressNotification(notificationId)
}

async function loadInfoFile(url, infoFileBase) {
	log('loading ' + url)
	const infoFile = await fetch(url).then(status).then(json)
	loadDataFiles(infoFile, infoFileBase)
}

async function loadData() {
	const infoFileBase = await fetch('./infoFile.url')
		.then(status)
		.then((response) => response.text())
		.then((path) => path.trim())

	const cachebuster = Date.now()
	await loadInfoFile(`${infoFileBase}/info.json?${cachebuster}`, infoFileBase)
}

export default loadData
