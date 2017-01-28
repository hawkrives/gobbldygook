const flatten = require('lodash/flatten')
const glob = require('glob')
const junk = require('junk')
const uniq = require('lodash/uniq')
const path = require('path')

module.exports = function findAreas(dir, filetype) {
  filetype = filetype || 'yaml'
  const sources = uniq(flatten(glob.sync(path.join(dir, `**/*.${filetype}`))))
  return sources.filter(junk.not)
}
