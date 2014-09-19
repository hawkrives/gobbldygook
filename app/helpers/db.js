'use strict';

var Promise = require('bluebird')
var db = require('../../../db.js/src/db.js')

var settings = {
	server: 'gobbldygook',
	version: 2,
	schema: {
		courses: {
			key: {autoIncrement: true},
			indexes: {
				profs:      {multiEntry: true},
				depts:      {multiEntry: true},
				places:     {multiEntry: true},
				times:      {multiEntry: true},
				gereqs:     {multiEntry: true},
				sourcePath: {multiEntry: false},
				crsid:      {multiEntry: false},
				clbid:      {multiEntry: false},
				deptnum:    {multiEntry: false},
			}
		},
		areas: {
			key: {autoIncrement: true, keyPath: 'sourcePath'},
			indexes: {
				type: {},
				sourcePath: {}
			}
		},
		students: {
			key: {autoIncrement: true}
		}
	}
}

module.exports = new Promise(function(resolve, reject) {
	db.open(settings)
		.then(function(server) { window.db = server; resolve(server); })
		.catch(function(err)   { reject(err); })
})
