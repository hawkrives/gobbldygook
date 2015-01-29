import treo from 'treo'

let schema = treo.schema()
	.version(1)
		.addStore('courses', { key: 'clbid' })
			.addIndex('clbid', 'clbid', { unique: true })
			.addIndex('credits', 'credits')
			.addIndex('crsid', 'crsid')
			.addIndex('dept', 'dept')
			.addIndex('depts', 'depts', { multi: true })
			.addIndex('deptnum', 'deptnum')
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
			.addIndex('term', 'term')
			.addIndex('times', 'times', { multi: true })
			.addIndex('title', 'title')
			.addIndex('type', 'type')
			.addIndex('year', 'year')
			.addIndex('sourcePath', 'sourcePath')
		.addStore('areas', { key: 'sourcePath' })
			.addIndex('type', 'type', { multi: true })
			.addIndex('sourcePath', 'sourcePath')
		.addStore('students', { key: 'id' })
	.version(2)
		.getStore('courses')
			.addIndex('words', 'words', { multi: true })
	.version(3)
		.getStore('courses')
			.addIndex('profWords', 'profWords', { multi: true })


import treoPromise from 'treo/plugins/treo-promise'
import queryTreoDatabase from './queryTreoDatabase'
import treoBatchGet from './treoBatchGet'
let db = treo('gobbldygook', schema)
	.use(queryTreoDatabase())
	.use(treoPromise())
	.use(treoBatchGet())

window.deleteDatabase = () => new Promise(resolve => {
	window.indexedDB.deleteDatabase('gobbldygook', resolve)
}).then((res) => {
	console.log('Database dropped')
	return res
})

window.eraseStorage = () => new Promise(resolve => {
	window.localStorage.clear()
	resolve()
}).then((res) => {
	console.log('Storage erased')
	return res
})

window.eraseDatabase = () => {
	window.deleteDatabase()
	window.eraseStorage()
}

window.database = db
export default db
