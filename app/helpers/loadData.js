'use strict';

var readJson = require('./readJson')
var Promise = require('bluebird')
var _ = require('lodash')
var add = require('./add')
var db = require('./db')
var buildDeptNum = require('./deptNum').buildDeptNum

var logDataLoading = false

function storeCourses(item) {
	window.courseCache = {}

	return new Promise(function(resolve, reject) {
		console.log(item.meta.path, 'called storeCourses')

		var courses = _.map(item.data.courses, function(course) {
			course.sourcePath = item.meta.path
			course.deptnum = buildDeptNum(course)
			window.deptNumToCrsid[course.deptnum] = course.crsid
			return course
		})

		window.db.add('courses', courses)
			.then(function(results) {
				resolve(item)
			}).catch(function (records, err) {
				reject(err)
			})
	})
}

function storeArea(item) {
	return new Promise(function(resolve, reject) {
		console.log(item.meta.path, 'called storeArea')
		var area = item.data.info

		area.sourcePath = item.meta.path

		window.db.add('areas', area)
			.then(function(results) {
				resolve(item)
			}).catch(function(records, err) {
				reject(err)
			})
	})
}

function storeItem(item) {
	if (item.type === 'courses') {
		return storeCourses(item)
	} else if (item.type === 'areas') {
		return storeArea(item)
	}
}

function cleanPriorData(item) {
	return new Promise(function (resolve, reject) {
		var path = item.meta.path
		console.info('deleting ' + item.type + ' from ' + path)

		var deleteItemsPromise = window.db.query(item.type, 'sourcePath')
			.only(path)
			.remove()
			.execute()

		deleteItemsPromise
			.then(function() {
				localStorage.removeItem(path)
				resolve(item)
			}).catch(function(err) {
				reject(err)
			})
	})
}

function cacheItemHash(item) {
	return new Promise(function(resolve, reject) {
		console.info(item.meta.path + ' called cacheItemHash')
		localStorage.setItem(item.meta.path, item.meta.hash)
		resolve(item)
	})
}

function updateDatabase(itemType, infoFromServer) {
	infoFromServer.path = '/data/' + itemType + '/' + infoFromServer.path
	var oldHash = localStorage.getItem(infoFromServer.path)
	var newHash = infoFromServer.hash
	var itemPath = infoFromServer.path

	if (newHash === oldHash) {
		if (logDataLoading) {
			console.log('skipped ' + itemPath)
		}
		return Promise.resolve(false)
	}

	if (logDataLoading) {
		console.log('need to add ' + itemPath)
	}

	var lookup = {
		'courses': 'courses',
		'areas': 'info'
	}
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
		.catch(function(err) {
			return Promise.reject(err.stack)
		})
		.done(function(item) {
			if (logDataLoading) {
				console.log('added ' + item.meta.path + ' (' + item.count + ' ' + item.type + ')')
			}
			return Promise.resolve(true)
		})
}

function loadDataFiles(infoFile) {
	console.log('load data files', infoFile)

	return Promise.all(_.map(infoFile.info, function(files) {
		return Promise.all(_.map(files, function(file) {
			return updateDatabase(infoFile.type, file)
		}))
	}))
}

/*
function loadDataFiles(infoFile) {
	console.log('load data files', infoFile)

	var progress = 0;
	var notification = new Cortex({
		message: 'Updating ' + infoFile.type,
		hasProgress: true,
		progressValue: progress,
		maxProgressValue: _.chain(infoFile.info).mapValues(_.size).reduce(add).value(),
		ident: infoFile.type
	})
	window.notifications.push(notification.val())

	return Promise.all(_.map(infoFile.info, function(files) {
		var allFilesLoadedPromise = Promise.all(_.map(files, function(file) {
			var dbUpdatedPromise = updateDatabase(infoFile.type, file)
			dbUpdatedPromise.then(function() {
				notification.progressValue.set(progress += 1)
			})
			return dbUpdatedPromise
		}))

		allFilesLoadedPromise.then(function() {
			setTimeout(notification.remove, 200)
		})

		return allFilesLoadedPromise
	}))
}
*/

function loadInfoFile(url) {
	console.log('loading', url)
	return readJson(url).then(loadDataFiles)
}

function loadData() {
	var infoFiles = [
		'/data/areas/info.json',
		'/data/courses/info.json',
	]
	return Promise.all(_.map(infoFiles, loadInfoFile))
}

module.exports = loadData
window.loadData = module.exports
