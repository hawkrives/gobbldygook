'use strict'
const loadArea = require('./load-area')
const { readFileSync } = require('graceful-fs')
const yaml = require('js-yaml')

module.exports = async function loadStudent(filename, { isFile = true } = {}) {
    let contents
    if (isFile) {
        contents = readFileSync(filename, 'utf-8')
    } else {
        contents = filename
    }
    let data = yaml.safeLoad(contents)
    data.areas = await Promise.all(data.areas.map(loadArea))
    data.filename = isFile ? filename : '<unknown>'
    return data
}
