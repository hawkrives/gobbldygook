import treo, {Database} from 'treo'
treo.Promise = require('bluebird')

import {queryTreoDatabase} from 'gb-search-queries'
import {batchGet} from 'gb-search-queries'

import schema from './db-schema'

const db = new Database('gobbldygook', schema)
	.use(queryTreoDatabase())
	.use(batchGet())

export default db


if (typeof window !== 'undefined') {
	window.deleteDatabase = () => {
		const DBDeleteRequest = window.indexedDB.deleteDatabase('gobbldygook')
		console.log('Commencing database deletion')
		DBDeleteRequest.onerror = () => console.log('Error deleting database.')
		DBDeleteRequest.onsuccess = () => console.log('Database deleted successfully')
	}

	window.eraseStorage = () => {
		console.log('Commencing storage erasure')
		window.localStorage.clear()
		console.log('Storage erased')
	}

	window.eraseDatabase = () => {
		window.deleteDatabase()
		window.eraseStorage()
	}

	window.database = db
}
