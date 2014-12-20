import * as Promise from 'bluebird'
import * as treo from 'treo'
import * as treoPromise from 'treo/plugins/treo-promise'

let schema = treo.schema()
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
			.addIndex('year',       'year',       {multi: false})
		.addStore('areas', { key: 'sourcePath' })
			.addIndex('type',       'type',       {multi: true})
			.addIndex('sourcePath', 'sourcePath', {multi: false})
	.version(2)
		.addStore('students', { key: 'id' })
			.addIndex('active', 'active', {multi: false, unique: true})

let db = treo('gobbldygook', schema)
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
