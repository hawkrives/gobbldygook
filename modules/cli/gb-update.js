'use strict'
const { checkForStaleData } = require('./lib/update-local-data-cache')

module.exports = function update() {
    // grab info.json
    // apply loadData's algorithm to it
    return checkForStaleData()
}
