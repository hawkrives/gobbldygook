import treo, {Database} from 'treo'
treo.Promise = require('bluebird')

import queryTreoDatabase from '../helpers/treo-plugins/query-treo-database'
import batchGet from '../helpers/treo-plugins/treo-batch-get'

import schema from './db-schema'

const db = new Database('gobbldygook', schema)
	.use(queryTreoDatabase())
	.use(batchGet())

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
