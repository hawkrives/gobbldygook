import treo from 'treo'
import treoWebsql from 'treo-websql'
import queryTreoDatabase from './query-treo-database'
import treoBatchGet from './treo-batch-get'
import Schema from 'idb-schema'

const schema = new Schema()
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
			.delIndex('profs')
			.addIndex('instructors', 'instructors', { multi: true })
			.delIndex('places')
			.addIndex('locations', 'locations', { multi: true })
			.delIndex('sect')
			.addIndex('section', 'section')
			.delIndex('sem')
			.addIndex('semester', 'semester')
			.delIndex('halfcredit')
	.version(5)
		.addStore('courseCache', { key: 'id' })
		.addStore('areaCache', { key: 'id' })
		.getStore('areas')
			.delIndex('sourcePath')
		.getStore('courses')
			.delIndex('desc')
			.delIndex('notes')
			.delIndex('title')
			.delIndex('name')

treoWebsql(treo)
const db = treo('gobbldygook', schema)
	.use(queryTreoDatabase)
	.use(treoBatchGet)

export default db

if (typeof window !== 'undefined') {
	window.deleteDatabase = () => {
		db.del().then(() => console.log('Database dropped'))
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
