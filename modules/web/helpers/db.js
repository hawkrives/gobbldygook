import treo, { Database } from 'treo'
treo.Promise = global.Promise
import debug from 'debug'
const log = debug('web:database')

import queryTreoDatabase from '../helpers/treo-plugins/query-treo-database'
import batchGet from '../helpers/treo-plugins/treo-batch-get'

import schema from './db-schema'

const db = new Database('gobbldygook', schema)
	.use(queryTreoDatabase())
	.use(batchGet())

export default db


if (typeof window !== 'undefined') {
	window.deleteDatabase = () => {
		const DBDeleteRequest = window.indexedDB.deleteDatabase('gobbldygook')
		log('Commencing database deletion')
		DBDeleteRequest.onerror = () => log('Error deleting database.')
		DBDeleteRequest.onsuccess = () => log('Database deleted successfully')
	}

	window.eraseStorage = () => {
		log('Commencing storage erasure')
		window.localStorage.clear()
		log('Storage erased')
	}

	window.eraseDatabase = () => {
		window.deleteDatabase()
		window.eraseStorage()
	}

	window.database = db
}
