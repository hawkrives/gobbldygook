var readJson = require('./readJson')
var Promise = require('bluebird')
var _ = require('lodash')

var buildDeptNum = require('./deptNum')

// get info.json
// for each list in file['info'],
	// check ['hash'] against the db's hash
		// if it matches, return.
		// else, request the file from ['path'],
			// delete the pervious data.
			// and store the new data in the database

function storeItem(item) {
	if (item.type === 'courses') {
		_.map(item.data.courses, function(course) {
			course.sourcePath = item.meta.path
			course.deptnum = buildDeptNum(course.depts.join('/') + ' ' + course.num + course.sect)
		})
		window.server.courses
			.add.apply(window.server, item.data.courses)
			.done(function() {
				console.log(_.size(item.data.courses) + ' courses have been added')
			})
	}

	else if (item.type === 'areas') {
		item.data.info.sourcePath = item.meta.path
		window.server.areas
			.add(item.data.info)
			.done(function(results) {
				console.log('an area has been added')
			})
	}
}

function deleteItems(type, path, key) {
	console.log('deleting ' + type + ' from ' + path)

	var itemsToDelete = window.server[type]
		.query('sourcePath')
		.only(path)
		.execute()
		.done()

	itemsToDelete.then(function(items) {
		var keysToDelete = _.pluck(items, key)
		var numberToDelete = _.size(keysToDelete)
		if (numberToDelete) {
			_.each(keysToDelete, function(key) {
				window.server[type]
					.remove(key)
					.done()
			})
		}
		console.log(numberToDelete + ' ' + type + ' have been removed')
	})

	return new Promise(function(resolve, reject) {
		itemsToDelete.then(resolve)
	})
}

function cleanPriorData(item) {
	var path = item.meta.path
	var hash = item.meta.hash

	// get rid of old items
	var deleteItemsPromise;
	if (item.type === 'areas') {
		deleteItemsPromise = deleteItems('areas', path, 'sourcePath')
	} else if (item.type === 'courses') {
		deleteItemsPromise = deleteItems('courses', path, 'clbid')
	} else {
		deleteItemsPromise = Promise.reject(new Error('Unknown item type' + item.type))
	}

	deleteItemsPromise.then(function() {
		localStorage.removeItem(path)
	})

	return deleteItemsPromise
}

function updateDatabase(itemType, infoFromServer) {
	infoFromServer.path = '/data/' + itemType + '/' + infoFromServer.path
	var oldHash = localStorage.getItem(infoFromServer.path)
	var newHash = infoFromServer.hash
	var itemPath = infoFromServer.path

	return new Promise(function(resolve, reject) {
		if (newHash !== oldHash) {
			console.log('adding ' + itemPath)
			readJson(itemPath)
				.then(function(data) {
					console.log('read ' + itemPath)
					var item = {
						data: data,
						meta: infoFromServer,
						type: itemType
					}
					cleanPriorData(item).then(function() {
						storeItem(item)
					}).then(function() {
						localStorage.setItem(item.meta.path, item.meta.hash)
					})
				})
				.catch(function(err) {
					reject(err.stack)
				})
				.done(function() {
					console.log('added ' + itemPath)
					resolve()
				})
		} else {
			console.log('skipped ' + itemPath)
			resolve()
		}
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
