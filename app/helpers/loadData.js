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

function storeCourses(item) {
	console.log('storing courses')
	let start = present()

	let coursesToStore = _.map(item.data, (course) => {
		course.sourcePath = item.meta.path
		return prepareCourse(course)
	})

	return db.store('courses').batch(coursesToStore)
		.then(() => {
			console.log(`Stored ${_.size(coursesToStore)} courses in ${present() - start}ms.`)
			return item
		})
		.catch((records, err) => {
			throw err
		})
}

function storeArea(item) {
	console.log(item.meta.path, 'called storeArea')

	let area = item.data.info
	area.sourcePath = item.meta.path

	return db.store('areas').put(area)
		.then(() => {
			return item
		})
		.catch((records, err) => {
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

async function cleanPriorData(item) {
	let {path, type} = item.meta
	console.info(`deleting ${type} from ${path}`)


	let items = []

	try {
		items = await db.store(item.type)
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

	return item
}

function cacheItemHash(item) {
	return new Promise((resolve) => {
		console.info(item.meta.path + ' called cacheItemHash')
		localStorage.setItem(item.meta.path, item.meta.hash)
		resolve(item)
	})
}

let lookup = {
	courses: 'courses',
	areas: 'info',
}

let logAdded = (item) => {
	if (logDataLoading) {
		console.log(`added ${item.meta.path} (${item.count} ${item.type})`)
	}
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

function updateDatabase(itemType, infoFromServer, notificationId, count) {
	let oldHash = localStorage.getItem(infoFromServer.path)
	let newHash = infoFromServer.hash

	let itemUrl = `./data/${itemType}/${infoFromServer.path}?v=${newHash}`

	if (newHash === oldHash) {
		if (logDataLoading) console.log('skipped ' + itemUrl)
		return Promise.resolve(false)
	}

	startProgressNotification(notificationId, itemType, count)

	if (logDataLoading) console.log('need to add ' + itemUrl)

	return fetch(itemUrl)
		.then(status)
		.then(json)
		.then((data) => {
			return {
				data: data,
				meta: infoFromServer,
				type: itemType,
				count: _.size(data[lookup[itemType]]) || 1,
			}
		})
		.then(cleanPriorData)
		.then(storeItem)
		.then(cacheItemHash)
		.then(logAdded)
		.then(updateProgressNotification(notificationId))
		.catch((err) => Promise.reject(err))
}

async function loadDataFiles(infoFile) {
	console.log('load data files', infoFile)

	// Only get the last four years of data
	let oldestYear = new Date().getFullYear() - 4
	let lastFourYears = filter(infoFile.files, file => parseInt(file.year) >= oldestYear)

	let notificationId = infoFile.type

	// Load them into the database
	let filePromises = map(lastFourYears, (file) => updateDatabase(infoFile.type, file, notificationId, size(lastFourYears)))

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
