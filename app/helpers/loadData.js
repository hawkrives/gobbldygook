import _ from 'lodash'
import Promise from 'bluebird'

import notificationActions from '../flux/notificationActions'
import {status, json} from './fetch'
import db from './db'

import {buildDept, buildDeptNum} from 'sto-helpers'
import {convertTimeStringsToOfferings} from 'sto-sis-time-parser'

let logDataLoading = false
// let logDataLoading = true

function prepareCourse(course) {
	course.name = course.name || course.title
	course.dept = course.dept || buildDept(course)
	course.deptnum = course.deptnum || buildDeptNum(course)
	course.offerings = course.offerings || convertTimeStringsToOfferings(course)
	return course
}

function storeCourses(item) {
	console.log('storing courses')
	let start = present()

	let coursesToStore = _.map(item.data.courses, (course) => {
		course.sourcePath = item.meta.path
		return prepareCourse(course)
	})

	return db.store('courses').batch(coursesToStore)
		.then((results) => {
			let end = present()
			console.log('Stored courses in', (end - start) + 'ms.')
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
		.then((results) => {
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

function cleanPriorData(item) {
	let path = item.meta.path
	console.info('deleting ' + item.type + ' from ' + path)

	return db.store(item.type)
		.index('sourcePath')
		.get(path)
		.then((items) => {
			return _.map(items, (item) => {
				let result = Object.create(null)
				result[item.clbid] = null
				return result
			})
		})
		.then((items) => db.store(item.type).batch(items))
		.then(() => {
			localStorage.removeItem(path)
			return item
		})
		.catch((err) => {
			throw err
		})
}

function cacheItemHash(item) {
	return new Promise((resolve, reject) => {
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
	if (logDataLoading)
		console.log(`added ${item.meta.path} (${item.count} ${item.type})`)
}

let startProgressNotification = _.curry((notificationId, itemType, count) => {
	notificationActions.startProgress(notificationId, `Loading ${itemType}`, {max: count}, true)
})

let updateProgressNotification = _.curry((notificationId, item) => {
	notificationActions.incrementProgress(notificationId)
})

let completeProgressNotification = _.curry((notificationId, x) => {
	notificationActions.removeNotification(notificationId, 1500)
})

function updateDatabase(itemType, infoFromServer, notificationId, count) {
	let oldHash = localStorage.getItem(infoFromServer.path)
	let newHash = infoFromServer.hash

	let itemUrl = `./data/${itemType}/${infoFromServer.path}?v=${newHash}`

	if (newHash === oldHash) {
		if (logDataLoading)  console.log('skipped ' + itemUrl)
		return Promise.resolve(false)
	}

	startProgressNotification(notificationId, itemType, count)

	if (logDataLoading)  console.log('need to add ' + itemUrl)

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

function loadDataFiles(infoFile) {
	console.log('load data files', infoFile)

	// Only get the last four years of data
	let lastFourYears = _.filter(infoFile.files,
		(file) => parseInt(file.year, 10) >= new Date().getFullYear() - 4)

	let notificationId = infoFile.type

	// Load them into the database
	let filePromises = _.map(lastFourYears, (file) => updateDatabase(infoFile.type, file, notificationId, _.size(lastFourYears)))

	return Promise.all(filePromises).then(completeProgressNotification(notificationId))
}

function loadInfoFile(url) {
	console.log('loading ' + url)
	return fetch(url)
		.then(status)
		.then(json)
		.then(loadDataFiles)
}

function loadData() {
	let infoFiles = [
		'./data/courses/info.json',
	]
	return Promise.all(infoFiles).map(loadInfoFile).done()
}

export default loadData
