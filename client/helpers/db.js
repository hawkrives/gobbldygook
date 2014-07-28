var Promise = require('bluebird')
var level = require('level-browserify')
var levelQuery = require('level-queryengine')
var jsonQueryEngine = require('jsonquery-engine')

var options = {
	valueEncoding: 'json'
}

var courseDb = levelQuery(level('./gobbldygook-courses', options))

courseDb.query.use(jsonQueryEngine())
courseDb.ensureIndex('profs')
courseDb.ensureIndex('depts')
courseDb.ensureIndex('places')
courseDb.ensureIndex('times')
courseDb.ensureIndex('gereqs')
courseDb.ensureIndex('sourcePath')
courseDb.ensureIndex('crsid')
courseDb.ensureIndex('deptnum')

var areaDb = levelQuery(level('./gobbldygook-areas', options))

areaDb.query.use(jsonQueryEngine())
areaDb.ensureIndex('type')
areaDb.ensureIndex('sourcePath')

module.exports.areas = areaDb
module.exports.courses = courseDb

// I wonder if this is ready when it says it is?
module.exports.isReady = Promise.resolve(true)

window.db = module.exports
