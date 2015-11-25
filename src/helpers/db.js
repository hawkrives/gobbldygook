import treo from 'treo'

let schema = treo.schema()
	.version(1)
		.addStore('courses', { key: 'clbid' })
			.addIndex('clbid', 'clbid', { unique: true })
			.addIndex('credits', 'credits')
			.addIndex('crsid', 'crsid')
			.addIndex('dept', 'dept')
			.addIndex('deptnum', 'deptnum')
			.addIndex('depts', 'depts', { multi: true })
			.addIndex('desc', 'desc')
			.addIndex('gereqs', 'gereqs', { multi: true })
			.addIndex('groupid', 'groupid')
			.addIndex('grouptype', 'grouptype')
			.addIndex('halfcredit', 'halfcredit')
			.addIndex('level', 'level')
			.addIndex('name', 'name')
			.addIndex('notes', 'notes')
			.addIndex('num', 'num')
			.addIndex('pf', 'pf')
			.addIndex('places', 'places', { multi: true })
			.addIndex('profs', 'profs', { multi: true })
			.addIndex('sect', 'sect')
			.addIndex('sem', 'sem')
			.addIndex('sourcePath', 'sourcePath')
			.addIndex('term', 'term')
			.addIndex('times', 'times', { multi: true })
			.addIndex('title', 'title')
			.addIndex('type', 'type')
			.addIndex('year', 'year')
		.addStore('areas', { key: 'sourcePath' })
			.addIndex('sourcePath', 'sourcePath')
			.addIndex('type', 'type', { multi: true })
		.addStore('students', { key: 'id' })
	.version(2)
		.getStore('courses')
			.addIndex('words', 'words', { multi: true })
	.version(3)
		.getStore('courses')
			.addIndex('profWords', 'profWords', { multi: true })
	.version(4)
		.getStore('courses')
			.dropIndex('profs')
			.addIndex('instructors', 'instructors', { multi: true })
			.dropIndex('places')
			.addIndex('locations', 'locations', { multi: true })
			.dropIndex('sect')
			.addIndex('section', 'section')
			.dropIndex('sem')
			.addIndex('semester', 'semester')
			.dropIndex('halfcredit')
	.version(5)
		.addStore('courseCache', { key: 'id' })
		.addStore('areaCache', { key: 'id' })
		.getStore('areas')
			.dropIndex('sourcePath')
		.getStore('courses')
			.dropIndex('desc')
			.dropIndex('notes')
			.dropIndex('title')
			.dropIndex('name')


import treoPromise from 'treo/plugins/treo-promise'
import queryTreoDatabase from '../helpers/treo-plugins/query-treo-database'
import batchGet from '../helpers/treo-plugins/treo-batch-get'
let db = treo('gobbldygook', schema)
	.use(treoPromise())
	.use(queryTreoDatabase)
	.use(batchGet)

export default db


if (typeof window !== 'undefined') {
	window.deleteDatabase = () => {
		window.indexedDB.deleteDatabase('gobbldygook', () =>
			console.log('Database dropped'))
	}

	window.eraseStorage = () => {
		window.localStorage.clear()
		console.log('Storage erased')
	}

	window.eraseDatabase = () => {
		window.deleteDatabase()
		window.eraseStorage()
	}

	window.database = db
}
