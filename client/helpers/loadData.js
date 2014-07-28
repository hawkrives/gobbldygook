var readJson = require('./readJson')
var Promise = require('bluebird')
var _ = require('lodash')
var add = require('./add')
var db = require('./db')

var buildDeptNum = require('./deptNum').buildDeptNum

function storeCourses(item) {
	return new Promise(function(resolve, reject) {
		console.log(item.meta.path, 'called storeCourses')
		var batchOfCourses = _.map(item.data.courses, function(course) {
			course.sourcePath = item.meta.path
			course.deptnum = buildDeptNum(course.depts.join('/') + ' ' + course.num + course.sect)
			return {type: 'put', key: course.clbid, value: course}
		})
		db.courses.batch(batchOfCourses, function(err) {
			if (err) {
				reject(err)
			}
			console.log(item.meta.path, 'has stored courses')
			resolve(item)
		})
	})
}

function storeArea(item) {
	return new Promise(function(resolve, reject) {
		console.log(item.meta.path, 'called storeArea')
		item.data.info.sourcePath = item.meta.path
		db.areas.put(item.data.info.sourcePath, item.data.info, function(err) {
			if (err) {
				reject(err)
			}
			resolve(item)
		})
	})
}

function storeItem(item) {
	return new Promise(function(resolve, reject) {
		if (item.type === 'courses') {
			return storeCourses(item)
		} else if (item.type === 'areas') {
			return storeArea(item)
		}
	})
}

function deleteItems(type, path, keyName) {
	return new Promise(function(resolve, reject) {
		console.log('deleting ' + type + ' from ' + path)

		var itemsToDelete = db[type].query('sourcePath', path)
			.on('data', function(items) {
				var keysToDelete = _.pluck(items, keyName)
				var numberToDelete = _.size(keysToDelete)
				console.log('keysToDelete', keysToDelete)
				if (numberToDelete) {
					var batchOfDeletions = _.map(keysToDelete, function(key) {
						return {type: 'del', key: key}
					})
					console.log('batchOfDeletions', batchOfDeletions)
					console.log(type + ' have been removed from ' + path)
					resolve(db[type].batch(batchOfDeletions))
				} else {
					resolve(true)
				}
			})
	})
}

function cleanPriorData(item) {
	return new Promise(function(resolve, reject) {
		var path = item.meta.path
		var hash = item.meta.hash

		// get rid of old items
		var deleteItemsPromise;
		if (item.type === 'courses') {
			deleteItemsPromise = deleteItems('courses', path, 'clbid')
		} else if (item.type === 'areas') {
			deleteItemsPromise = deleteItems('areas', path, 'sourcePath')
		} else {
			deleteItemsPromise = Promise.reject(new Error('Unknown item type ' + item.type))
		}

		console.log('deleteItemsPromise', deleteItemsPromise)

		deleteItemsPromise.then(function() {
			console.log('deleteItemsPromise is done')
			localStorage.removeItem(path)
			resolve(item)
		}).catch(function(err) {
			reject(err)
		})
	})
}

function cacheItemHash(item) {
	console.log(item.meta.path + ' called cacheItemHash')
	localStorage.setItem(item.meta.path, item.meta.hash)
	return Promise.resolve(item)
}

function updateDatabase(itemType, infoFromServer) {
	infoFromServer.path = '/data/' + itemType + '/' + infoFromServer.path
	var oldHash = localStorage.getItem(infoFromServer.path)
	var newHash = infoFromServer.hash
	var itemPath = infoFromServer.path

	return new Promise(function(resolve, reject) {
		if (newHash !== oldHash) {
			console.log('need to add ' + itemPath)
			readJson(itemPath)
				.then(function(data) {
					return {
						data: data,
						meta: infoFromServer,
						type: itemType
					}
				})
				.then(cleanPriorData)
				.then(storeItem)
				.then(cacheItemHash)
				.catch(function(err) {
					reject(err.stack)
				})
				.done(function(item) {
					console.log('added ' + itemPath + ' (' + _.size(item) + ' ' + itemType + ')')
					resolve(true)
				})
		} else {
			console.log('skipped ' + itemPath)
			resolve(false)
		}
	})
}

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

function loadInfoFile(url) {
	console.log('loading', url)
	return readJson(url)
		.then(loadDataFiles)
}

function loadData() {
	var infoFiles = [
		'/data/areas/info.json',
		'/data/courses/info.json',
	]
	return new Promise(function(resolve, reject) {
		Promise.all(_.map(infoFiles, loadInfoFile)).then(resolve)
	})
}

module.exports = loadData
