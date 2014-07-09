var readJson = require('./readJson')
var Q = require("q")
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
	console.log(items)
	// TODO: Delete items.
}

function storeItem(item) {
	if (item.meta.type === 'courses') {
		return window.server.courses.add(data)
	}
}

function cleanPriorData(item) {
	return new Q.promise(function(resolve, reject) {
		// Clear out old courses ...
		window.server.courses.query('sourcePath')
			.only(item.path)
			.done(deleteItems)

		// ... areas of study ...
		window.server.areas.query('sourcePath')
			.only(item.path)
			.done(deleteItems)

		// ... and the paths themselves.
		window.server.sources.query('path')
			.only(item.path)
			.modify({path: item.path, filename: item.filename, hash: item.hash})
			.execute()
			.done()
		
		resolve()
	})
}

var updateDatabase = _.curry(function updateDatabase(itemType, itemFromJson) {
	return getItemFromDb(itemFromJson.path).then(function(itemFromDb) {
		if (itemFromJson.hash === itemFromDb.hash) {
			return;
		} else {
			itemFromJson.path = '/data/' + itemType + '/' + itemFromJson.path
			return readJson(itemFromJson.path)
				.then(function(data) {
					cleanPriorData(itemFromJson)
					return {data: data, meta: itemFromJson}
				})
				.then(storeItem)
		}
	})
})

function loadDataFiles(info) {
	console.log('loadDataFiles', info)
	return new Q.all(_.map(info, updateDatabase(info.type)))
}

function loadInfoFile(url) {
	console.log('loading', url)
	readJson(url)
		.then(loadDataFiles)
}

function loadData() {
	var infoFiles = [
		'/data/areas/info.json',
		'/data/courses/info.json',
	]
	return new Q.all(_.map(infoFiles, loadInfoFile))
}

module.exports = loadData
