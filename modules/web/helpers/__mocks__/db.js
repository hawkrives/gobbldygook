/* eslint-env jest */
// @flow

// $FlowFixMe
import setGlobals from 'indexeddbshim'
let dfn = Object.defineProperty
// $FlowFixMe
Object.defineProperty = null
global.window = global
setGlobals(global.window)
// $FlowFixMe
Object.defineProperty = dfn

// $FlowFixMe
const {default: db} = require.requireActual('../db')

db.__clear = function clearDatabase() {
    return Promise.all(db.stores.map(s => db.store(s).clear()))
}

export default db
