var readJson = require('./readJson')
var Promise = require("bluebird")
var _ = require('lodash')

// get info.json
// for each list in file['info'],
	// check ['hash'] against the db's hash
		// if it matches, return.
		// else, request the file from ['path'],
			// delete the pervious data.
			// and store the new data in the database

var pathPrefix = '/data/'

function deleteItems(items) {
	if (_.size(items) > 0) {
		console.log('items to delete', items)
	}

	// TODO: Delete items.
}

function storeItem(item) {
	if (item.type === 'courses') {
		_.map(item.data.courses, function(course) {
			course.sourcePath = item.meta.path
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

function cleanPriorData(item) {
	var path = item.meta.path
	var hash = item.meta.hash

	return new Promise.all([
		// get rid of old items
		// and only query the appropriate type
		window.server[item.type].query('sourcePath')
			.only(path)
			.execute()
			.then(deleteItems)
			.done()
		,

		new Promise(function(resolve, reject) {
			// ... and the paths themselves.
			localStorage.removeItem(path)
			localStorage.setItem(path, hash)
			resolve()
		})
	])
}

function updateDatabase(itemType, infoFromServer) {
	infoFromServer.path = '/data/' + itemType + '/' + infoFromServer.path
	var oldHash = localStorage.getItem(infoFromServer.path)
	var newHash = infoFromServer.hash
	var itemPath = infoFromServer.path
	return new Promise(function(resolve, reject) {
		if (newHash !== oldHash) {// || itemType === 'areas') {
			console.log('have to add', itemPath)
			readJson(itemPath)
				.then(function(data) {return {data: data, meta: infoFromServer, type: itemType}})
				.then(cleanPriorData)
				.then(storeItem)
				.catch(function(err) {
					reject(err.stack)
				})
				.done(function() {
					resolve('had to add ' + itemPath)
				})
		} else {
			resolve('bypassed adding ' + itemPath)
		}
	})
}

function loadDataFiles(info) {
	console.log('loadDataFiles', info)
			return updateDatabase(info.type, file)
		}))
	}))
}

function loadInfoFile(url) {
	console.log('loading', url)
	readJson(url)
		.then(loadDataFiles)
		.done()
}

function loadData() {
	var infoFiles = [
		'/data/areas/info.json',
		'/data/courses/info.json',
	]
	return Promise.all(_.map(infoFiles, loadInfoFile))
}

module.exports = loadData
