#!/usr/bin/env node

const fs = require('graceful-fs')
const glob = require('glob')
const negate = require('lodash/negate')
const del = require('del')
const cpy = require('cpy')

const isDir = path => fs.statSync(path).isDirectory()
const inWhitelist = whitelist => filename => whitelist.some(pattern => pattern.test(filename))
const remove = path => {
  console.log(path)
  del.sync(path)
}

// remove extra top-level folders
const folderWhitelist = [ /^build$/ ]
glob.sync('*')
	.filter(isDir)
	.filter(negate(inWhitelist(folderWhitelist)))
	.forEach(remove)

console.log('removed top-level folders')

// remove extra top-level files
const filesWhitelist = [ /^\.git.*/, /^package\.json$/ ]
glob.sync('*')
	.filter(negate(isDir))
	.filter(negate(inWhitelist(filesWhitelist)))
	.forEach(remove)

console.log('removed top-level files')

// move build/* to ./, and remove build/
cpy('build/*', './').then(() => {
  console.log('moved build/* to build')
  return del('build/')
}).then(() => {
  console.log('removed build/')
  console.log('done')
})
