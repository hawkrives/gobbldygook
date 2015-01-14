import treo from 'treo'

let schema = treo.schema()
	.version(1)
		.addStore('courses', { key: 'id' })
			.addIndex('sourcePath', 'sourcePath', {multi: false})
			.addIndex('clbid',      'clbid',      {multi: false})
			.addIndex('term',       'term',       {multi: false})
		.addStore('areas', { key: 'sourcePath' })
			.addIndex('type',       'type',       {multi: true})
			.addIndex('sourcePath', 'sourcePath', {multi: false})
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
