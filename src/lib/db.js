// set up PouchDB
import PouchDB from 'pouchdb'
import find from 'pouchdb-find'
PouchDB.plugin(find)
import search from 'pouchdb-quick-search'
PouchDB.plugin(search)

// if we're running in node, make a directory for the databases
const prefix = process.env.NODE_ENV === 'cli' ? './databases/' : ''
// if (process.env.NODE_ENV === 'cli') {
// 	const mkdir = require('mkdirp')
// 	mkdir.sync(prefix)
// }

let opts = {}
// if we're running a test, just stick the database in memory
if (process.env.NODE_ENV === 'test') {
	opts.db = require('memdown')
}


// make the databases
export const courseDb  = new PouchDB(prefix + 'courses',  {...opts, size: 50})
export const areaDb    = new PouchDB(prefix + 'areas',    {...opts, size: 5})
export const studentDb = new PouchDB(prefix + 'students', {...opts, size: 5})
export const cacheDb   = new PouchDB(prefix + 'cache',    {...opts, size: 1})
global.database = {courseDb, areaDb, studentDb, cacheDb}

// set up course indices
courseDb.createIndex({index: {fields: ['clbid']}})  // should be unique
courseDb.createIndex({index: {fields: ['credits']}})
courseDb.createIndex({index: {fields: ['crsid']}})
courseDb.createIndex({index: {fields: ['dept']}})
courseDb.createIndex({index: {fields: ['depts']}})  // is an array
courseDb.createIndex({index: {fields: ['deptnum']}})
courseDb.createIndex({index: {fields: ['desc']}})
courseDb.createIndex({index: {fields: ['gereqs']}})  // is an array
courseDb.createIndex({index: {fields: ['groupid']}})
courseDb.createIndex({index: {fields: ['grouptype']}})
courseDb.createIndex({index: {fields: ['level']}})
courseDb.createIndex({index: {fields: ['name']}})
courseDb.createIndex({index: {fields: ['notes']}})
courseDb.createIndex({index: {fields: ['num']}})
courseDb.createIndex({index: {fields: ['pf']}})
courseDb.createIndex({index: {fields: ['locations']}})  // is an array
courseDb.createIndex({index: {fields: ['instructors']}})  // is an array
courseDb.createIndex({index: {fields: ['section']}})
courseDb.createIndex({index: {fields: ['semester']}})
courseDb.createIndex({index: {fields: ['term']}})
courseDb.createIndex({index: {fields: ['times']}})  // is an array
courseDb.createIndex({index: {fields: ['title']}})
courseDb.createIndex({index: {fields: ['type']}})
courseDb.createIndex({index: {fields: ['year']}})
courseDb.createIndex({index: {fields: ['sourcePath']}})
courseDb.createIndex({index: {fields: ['words']}})  // is an array
courseDb.createIndex({index: {fields: ['profWords']}})  // is an array

// set up area indices
areaDb.createIndex({index: {fields: ['type']}})  // is an array
areaDb.createIndex({index: {fields: ['sourcePath']}})
