'use strict';

import * as _ from 'lodash'
import * as Promise from 'bluebird'

import readJson from './readJson.es6'
import add from './add.es6'
import {db, courseCache} from './db.es6'
import {buildDeptNum, buildDept} from './deptNum.es6'
import {discoverRecentYears} from './recentTime.es6'
import {convertTimeStringsToOfferings} from './time.es6'

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

	_.map(item.data.courses, function(course) {
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
		.then(function(results) {
			var end = performance.now()
			console.log('Stored courses in', (end - start) + 'ms.')
		}).catch(function (records, err) {
			throw err
		})
}

function storeArea(item) {
	console.log(item.meta.path, 'called storeArea')

	var area = item.data.info
	area.sourcePath = item.meta.path

	return db.store('areas').put(area)
		.then(function(results) {
			return item
		})
		.catch(function(records, err) {
			throw err
		})
}

function storeItem(item) {
	if (item.type === 'courses') {
		return gatherCourses(item)
	} else if (item.type === 'areas') {
		return storeArea(item)
	}
}

function cleanPriorData(item) {
	var path = item.meta.path
	console.info('deleting ' + item.type + ' from ' + path)

	return db.store(item.type)
		.index('sourcePath').get(path)
		.then(function(items) {
			return _.map(items, function(item) {
				var result = Object.create(null)
				result[item.clbid] = null
				return result
			})
		})
		.then(function(items) {
			return db.store(item.type).batch(items)
		})
		.then(function(items) {
			localStorage.removeItem(path)
			return item
		})
		.catch(function(err) {
			throw err
		})
}

function cacheItemHash(item) {
	return new Promise(function(resolve, reject) {
		console.info(item.meta.path + ' called cacheItemHash')
		localStorage.setItem(item.meta.path, item.meta.hash)
		resolve(item)
	})
}

var lookup = {
	courses: 'courses',
	areas: 'info'
}

function updateDatabase(itemType, infoFromServer) {
	infoFromServer.path = './data/' + itemType + '/' + infoFromServer.path
	var oldHash = localStorage.getItem(infoFromServer.path)
	var newHash = infoFromServer.hash
	var itemPath = infoFromServer.path

	if (newHash === oldHash) {
		if (logDataLoading)  console.log('skipped ' + itemPath)
		return Promise.resolve(false)
	}

	if (logDataLoading)  console.log('need to add ' + itemPath)

	return readJson(itemPath)
		.then(function(data) {
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
		.then(function(item) {
			if (logDataLoading)
				console.log('added ' + item.meta.path + ' (' + item.count + ' ' + item.type + ')')
		})
		.catch(function(err) {
			return Promise.reject(err.stack)
		})
}

function loadDataFiles(infoFile) {
	console.log('load data files', infoFile)

	var files = _(infoFile.info)
		.map((files) =>
			_.map(files, (file) =>
				updateDatabase(infoFile.type, file)))
		.flatten()
		.value()

	return Promise.all(files)
		.then(() => {
			if (infoFile.type === 'courses')
				return storeCourses()
			return Promise.resolve(true)
		})
}

function loadInfoFile(url) {
	console.log('loading ' + url)
	return readJson(url).then(loadDataFiles)
}

function loadData() {
	var infoFiles = [
		'./data/areas/info.json',
		'./data/courses/info.json',
	]
	return Promise.all(_.map(infoFiles, loadInfoFile)).then(primeCourseCache)
}

window.loadData = loadData
export default loadData
