'use strict';

var Promise = require('bluebird')
var treo = require('treo')
var treoPromise = require('treo/plugins/treo-promise')

var schema = treo.schema()
	.version(1)
		.addStore('courses', { key: 'clbid' })
			.addIndex('profs',      'profs',      {multi: true})
			.addIndex('depts',      'depts',      {multi: true})
			.addIndex('places',     'places',     {multi: true})
			.addIndex('times',      'times',      {multi: true})
			.addIndex('gereqs',     'gereqs',     {multi: true})
			.addIndex('sourcePath', 'sourcePath', {multi: false})
			.addIndex('crsid',      'crsid',      {multi: false})
			.addIndex('clbid',      'clbid',      {multi: false})
			.addIndex('deptnum',    'deptnum',    {multi: false})
		.addStore('areas', { key: 'sourcePath' })
			.addIndex('type',       'type',       {multi: true})
			.addIndex('sourcePath', 'sourcePath', {multi: false})
	.version(2)
		.addStore('students', { key: 'id'   })
		.addStore('cache',    { key: 'path' })

var db = treo('gobbldygook', schema)
	.use(treoPromise())

module.exports = window.database = db
