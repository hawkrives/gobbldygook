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


import treoPromise from 'treo/plugins/treo-promise'
import queryTreoDatabase from './queryTreoDatabase'
let db = treo('gobbldygook', schema)
	.use(queryTreoDatabase())
	.use(treoPromise())


window.eraseDatabase = () => {
	window.database.drop().then(() => {
		console.log('Database dropped')
		localStorage.clear()
		console.log('localStorage cleared')
	})
}

window.database = db
export default db
