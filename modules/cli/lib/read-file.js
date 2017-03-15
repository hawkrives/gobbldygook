'use strict'
require('whatwg-fetch')
const { status, json, text } = require('../../lib/fetch-helpers')

const startsWith = require('lodash/startsWith')
const yaml = require('js-yaml')
const pify = require('pify')

const fs = pify(require('graceful-fs'))

module.exports.loadFile = loadFile
function loadFile(pathOrUrl) {
    return startsWith(pathOrUrl, 'http')
        ? fetch(pathOrUrl).then(status).then(text)
        : fs.readFileAsync(pathOrUrl, { encoding: 'utf-8' })
}

module.exports.loadJsonFile = loadJsonFile
function loadJsonFile(pathOrUrl) {
    return startsWith(pathOrUrl, 'http')
        ? fetch(pathOrUrl).then(status).then(json)
        : fs.readFileAsync(pathOrUrl, { encoding: 'utf-8' }).then(JSON.parse)
}

module.exports.loadYamlFile = loadYamlFile
function loadYamlFile(pathOrUrl) {
    return startsWith(pathOrUrl, 'http')
        ? fetch(pathOrUrl).then(status).then(text).then(yaml.safeLoad)
        : fs
              .readFileAsync(pathOrUrl, { encoding: 'utf-8' })
              .then(yaml.safeLoad)
}

module.exports.tryReadFile = tryReadFile
function tryReadFile(path) {
    try {
        return fs.readFileSync(path, { encoding: 'utf-8' })
    } catch (err) {} // eslint-disable-line brace-style, no-empty

    return false
}

module.exports.tryReadJsonFile = tryReadJsonFile
function tryReadJsonFile(path) {
    try {
        return JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }))
    } catch (err) {} // eslint-disable-line brace-style, no-empty

    return false
}
