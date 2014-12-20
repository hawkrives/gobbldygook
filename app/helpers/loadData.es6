import * as _ from 'lodash'
import * as Promise from 'bluebird'

import {status, json} from 'helpers/fetch'
import {db, courseCache} from 'helpers/db'
import {buildDeptNum, buildDept} from 'helpers/deptNum'
import {discoverRecentYears} from 'helpers/recentTime'
import {convertTimeStringsToOfferings} from 'helpers/time'

var logDataLoading = false
// var logDataLoading = true

function prepareCourse(course) {
	course.dept = course.dept || buildDept(course)
	course.deptnum = course.deptnum || buildDeptNum(course)
	course.offerings = course.offerings || convertTimeStringsToOfferings(course)
	return course
}

function primeCourseCache() {
	console.log('Priming course cache...')

	let start = performance.now()
	let recentYears = discoverRecentYears()
	let setOfCourses = []
	let courses = db.store('courses').index('year')

	return Promise.all(
		_.map(recentYears, (year) =>
			courses.get(year).then((courses) => _.each(courses, c => courseCache[c.clbid] = prepareCourse(c)))
	)).then(() => {
		let end = performance.now()
		console.log('Cached courses in', (end - start) + 'ms.')
	})
}

var coursesToStore = [];

function gatherCourses(item) {
	console.log(item.meta.path, 'called storeCourses')
	var start = performance.now()

	_.map(item.data.courses, (course) => {
		course.sourcePath = item.meta.path
		var prepared = prepareCourse(course)
		coursesToStore.push(prepared)
	})

	var end = performance.now()
	console.log('Gathered', item.meta.path, 'in', (end - start) + 'ms.')

	return item
}

function storeCourses() {
	console.log('storing courses')
	var start = performance.now()

	return db.store('courses').batch(coursesToStore)
		.then((results) => {
			var end = performance.now()
			console.log('Stored courses in', (end - start) + 'ms.')
			return item
		})
		.catch((records, err) => {
			throw err
		})
}

function storeArea(item) {
	console.log(item.meta.path, 'called storeArea')

	var area = item.data.info
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
		return gatherCourses(item)
	}
	else if (item.type === 'areas') {
		return storeArea(item)
	}
}

function cleanPriorData(item) {
	var path = item.meta.path
	console.info('deleting ' + item.type + ' from ' + path)

	return db.store(item.type)
		.index('sourcePath')
		.get(path)
		.then((items) => {
			return _.map(items, (item) => {
				var result = Object.create(null)
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

var lookup = {
	courses: 'courses',
	areas: 'info',
}

function updateDatabase(itemType, infoFromServer) {
	var oldHash = localStorage.getItem(infoFromServer.path)
	var newHash = infoFromServer.hash

	var itemUrl = _.template('./data/${type}/${path}?v=${hash}',
		{type: itemType, path: infoFromServer.path, hash: newHash})

	if (newHash === oldHash) {
		if (logDataLoading)  console.log('skipped ' + itemUrl)
		return Promise.resolve(false)
	}

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
		.then((item) => {
			if (logDataLoading)
				console.log('added ' + item.meta.path + ' (' + item.count + ' ' + item.type + ')')
		})
		.catch((err) => {
			return Promise.reject(err.stack)
		})
}

function loadDataFiles(infoFile) {
	console.log('load data files', infoFile)

	var files = _(infoFile.info)
		.map((files) =>
			_(files)
				.filter((file) => parseInt(file.year, 10) > new Date().getFullYear() - 5)
				.map((file) => updateDatabase(infoFile.type, file))
				.value())
		.flatten()
		.value()

	return Promise.all(files).then(() => Promise.resolve(true))
}

function loadInfoFile(url) {
	console.log('loading ' + url)
	return fetch(url)
		.then(status)
		.then(json)
		.then(loadDataFiles)
}

function loadData() {
	var infoFiles = [
		// './data/areas/info.json',
		'./data/courses/info.json',
	]
	return Promise.all(_.map(infoFiles, loadInfoFile)).then(primeCourseCache)
}

window.loadData = loadData
export default loadData
