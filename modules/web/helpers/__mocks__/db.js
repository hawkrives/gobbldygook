/* eslint-env jest */
// @flow

import setGlobals from 'indexeddbshim'
let def
setGlobals(global, (function() {
    def = Object.defineProperty
    // $FlowFixMe
    Object.defineProperty = null
})())
// $FlowFixMe
Object.defineProperty = def

// $FlowFixMe
const {default: db} = require.requireActual('../db')

db.__clear = async function clearDatabase() {
    return Promise.all([
        db.store('courses').clear(),
        db.store('areas').clear(),
        db.store('students').clear(),
        db.store('courseCache').clear(),
        db.store('areaCache').clear(),
    ])
}

export default db
