import treo, {Database} from 'treo'

import Promise from 'es6-promise'
treo.Promise = Promise

import queryTreoDatabase from '@gob/treo-plugin-query'
import batchGet from '@gob/treo-plugin-batch-get'

import schema from './schema'

const db = new Database('gobbldygook', schema)
    .use(queryTreoDatabase())
    .use(batchGet())

export default db

if (typeof window !== 'undefined') {
    window.deleteDatabase = () => {
        const DBDeleteRequest = window.indexedDB.deleteDatabase('gobbldygook')
        //log('Commencing database deletion')
        DBDeleteRequest.onerror = () =>
            console.error('Error deleting database.')
        DBDeleteRequest.onsuccess = () =>
            console.info('Database deleted successfully')
    }

    window.eraseStorage = () => {
        //log('Commencing storage erasure')
        window.localStorage.clear()
        //log('Storage erased')
    }

    window.eraseDatabase = () => {
        window.deleteDatabase()
        window.eraseStorage()
    }

    window.__database = db
}
